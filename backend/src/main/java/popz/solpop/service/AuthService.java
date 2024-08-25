package popz.solpop.service;

import popz.solpop.dto.Login;
import popz.solpop.dto.LoginResponse;
import popz.solpop.dto.Response;
import popz.solpop.dto.SignUp;

import popz.solpop.entity.Account;
import popz.solpop.entity.Level;
import popz.solpop.entity.Member;

import popz.solpop.repository.AccountRepository;
import popz.solpop.repository.LevelRepository;
import popz.solpop.repository.MemberRepository;
import popz.solpop.security.TokenProvider;


import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.time.LocalDateTime;

@Service
public class AuthService {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private AccountRepository accountRepository;


    public Response<?> signUp(SignUp dto) {
        String userName = dto.getUserName();
        String password = dto.getPassword();

        try {
            if(memberRepository.existsByUserName(userName)) {
                return Response.setFailed("중복된 아이디가 있습니다.");
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패했습니다.");
        }

        // 회원 가입 시 기본 레벨 설정
        Level level = levelRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("Invalid level ID"));

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if(!isPasswordMatch) {
            return Response.setFailed("비밀번호 암호화에 실패했습니다.");
        }

        boolean isAccountLink = dto.getAccountNo() != null;

        Member memberEntity = Member.builder()
                .userName(dto.getUserName())
                .password(dto.getPassword())
                .name(dto.getName())
                .userId(dto.getUserId())
                .token(dto.getToken())
                .isAccountLink(isAccountLink)
                .createdAt(LocalDateTime.now())
                .editedAt(LocalDateTime.now())
                .level(level)
                .build();


        memberEntity.setPassword(hashedPassword);

        try {
            Member member = memberRepository.save(memberEntity);

            // 계좌 정보를 포함한 회원가입 시 계좌 연동
            if(isAccountLink){
                Account account = new Account();
                account.setMember(member);
                account.setAccountNo(dto.getAccountNo());
                accountRepository.save(account);
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패했습니다.");
        }

        return Response.setSuccess("회원 생성에 성공했습니다.");
    }

    @Transactional
    public Response<LoginResponse> login(Login dto, HttpServletResponse response) {
        String userName = dto.getUserName();
        String password = dto.getPassword();

        // 아이디로 멤버 조회
        Member memberEntity = memberRepository.findMemberByUserName(userName);

        // 사용자 검증
        if (memberEntity == null) {
            return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = memberEntity.getPassword();

        if (!passwordEncoder.matches(password, encodedPassword)) {
            return Response.setFailed("비밀번호가 일치하지 않습니다.");
        }


        int accessTokenDuration = 3600; // 1 hour
        int refreshTokenDuration = 1209600; // 2 weeks

        // 토큰 생성
        String accessToken = tokenProvider.createAccessToken(userName, accessTokenDuration);
        String refreshToken = tokenProvider.createRefreshToken(userName, refreshTokenDuration);

        // 리프레시토큰 데이터베이스에 저장
        memberEntity.setToken(refreshToken);
        memberRepository.saveAndFlush(memberEntity);

        // 리프레시토큰 쿠키 설정
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
        refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 적용
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenDuration);
        response.addCookie(refreshTokenCookie);

        if (accessToken == null) {
            return Response.setFailed("토큰 생성에 실패했습니다.");
        }

        // 클라이언트에 엑세스토큰만 전달
        LoginResponse loginResponseDto = new LoginResponse(accessToken, accessTokenDuration);

        return Response.setSuccessData("로그인에 성공했습니다.", loginResponseDto);
    }
}
