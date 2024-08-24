package popz.solpop.service;

import popz.solpop.dto.Login;
import popz.solpop.dto.LoginResponse;
import popz.solpop.dto.Response;
import popz.solpop.dto.SignUp;

import popz.solpop.entity.Level;
import popz.solpop.entity.Member;

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

    public Response<?> signUp(SignUp dto) {
        String userName = dto.getUserName();
        String password = dto.getPassword();
        Integer levelId = dto.getLevelId();

        try {
            if(memberRepository.existsByUserName(userName)) {
                return Response.setFailed("중복된 아이디가 있습니다.");
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패했습니다.");
        }

        Level level = levelRepository.findById(levelId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid level ID"));

        Member memberEntity = Member.builder()
                .userName(dto.getUserName())
                .password(dto.getPassword())
                .name(dto.getName())
                .userId(dto.getUserId())
                .token(dto.getToken())
                .isAccountLink(dto.getIsAccountLink())
                .createdAt(LocalDateTime.now())
                .editedAt(LocalDateTime.now())
                .level(level)
                .build();

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if(!isPasswordMatch) {
            return Response.setFailed("암호화에 실패했습니다.");
        }

        memberEntity.setPassword(hashedPassword);

        try {
            memberRepository.save(memberEntity);
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패했습니다.");
        }

        return Response.setSuccess("회원 생성에 성공했습니다.");
    }

    @Transactional
    public Response<LoginResponse> login(Login dto, HttpServletResponse response) {
        String userName = dto.getUserName();
        String password = dto.getPassword();
//        String userType = dto.getUserType();
        Member memberEntity = memberRepository.findMemberByUserName(userName);
        try {
            if (memberEntity == null) {
                return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = memberEntity.getPassword();

            if (!passwordEncoder.matches(password, encodedPassword)) {
                return Response.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패했습니다.");
        }

        int accessTokenDuration = 3600; // 1 hour
        int refreshTokenDuration = 1209600; // 2 weeks
        String accessToken = tokenProvider.createAccessToken(userName, accessTokenDuration);
        String refreshToken = tokenProvider.createRefreshToken(userName, refreshTokenDuration);

        memberEntity.setToken(refreshToken);
        memberRepository.saveAndFlush(memberEntity);

        // Refresh Token 쿠키 설정
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
        refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 적용
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenDuration);
        response.addCookie(refreshTokenCookie);

        if (accessToken == null || refreshToken == null) {
            return Response.setFailed("토큰 생성에 실패했습니다.");
        }

        LoginResponse loginResponseDto = new LoginResponse(accessToken, accessTokenDuration, refreshToken, refreshTokenDuration, memberEntity);

        return Response.setSuccessData("로그인에 성공했습니다.", loginResponseDto);
    }
}
