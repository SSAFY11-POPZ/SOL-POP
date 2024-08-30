package popz.solpop.service;

import jakarta.annotation.PostConstruct;
import org.springframework.web.reactive.function.client.WebClient;
import popz.solpop.dto.*;

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
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.time.LocalDateTime;
import java.util.Map;

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
        String userId = dto.getUserId();
        String userName = parseUserName(userId);
        String password = dto.getPassword();

        try {
            if(memberRepository.existsByUserId(userId)) {
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
                .userName(userName)
                .password(dto.getPassword())
                .name(dto.getName())
                .userId(dto.getUserId())
                .token(dto.getToken())
                .userKey(dto.getUserKey())
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

    private String parseUserName(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
        return email.split("@")[0];  // 이메일에서 @ 앞부분을 파싱하여 반환
    }


    @Transactional
    public Response<LoginResponse> login(Login dto, HttpServletResponse response) {
        String userId = dto.getUserId();
        String password = dto.getPassword();

        // 아이디로 멤버 조회
        Member memberEntity = memberRepository.findMemberByUserId(userId);

        // 사용자 검증
        if (memberEntity == null) {
            return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = memberEntity.getPassword();

        if (!passwordEncoder.matches(password, encodedPassword)) {
            return Response.setFailed("비밀번호가 일치하지 않습니다.");
        }


        int accessTokenDuration = 999999; // 1 hour
        int refreshTokenDuration = 1209600; // 2 weeks

        // 토큰 생성
        String accessToken = tokenProvider.createAccessToken(userId, accessTokenDuration);
        String refreshToken = tokenProvider.createRefreshToken(userId, refreshTokenDuration);

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

    @Transactional
    public Response<?> updatePassword(Member member, String password) {


        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if (!isPasswordMatch) {
            return Response.setFailed("암호화에 실패했습니다.");
        }

        member.setPassword(hashedPassword);

        return Response.setSuccess("비밀번호가 변경되었습니다.");

    }

    private WebClient webClient;

    @PostConstruct
    public void initWebClient() {
        webClient = WebClient.create("https://finopenapi.ssafy.io/ssafy/api/v1");
    }

    public ResponseEntity<Map> createSSAFYUser(Map<String, Object> ssafyUserCreateRequest) {
        try {
            return webClient.post()
                    .uri("/member")
                    .bodyValue(ssafyUserCreateRequest)
                    .exchangeToMono(this::handleResponse)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create SSAFY user", e);
        }
    }

    public ResponseEntity<Map> checkSSAFYUser(Map<String, Object> ssafyUserCheckRequest) {
        try {
            return webClient.post()
                    .uri("/member/search")
                    .bodyValue(ssafyUserCheckRequest)
                    .exchangeToMono(this::handleResponse)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Failed to check SSAFY user", e);
        }
    }

    public ResponseEntity<Map> createSSAFYAccount(Map<String, Object> ssafyCreateAccountRequest) {
        try {
            return webClient.post()
                    .uri("/edu/demandDeposit/createDemandDepositAccount")
                    .bodyValue(ssafyCreateAccountRequest)
                    .exchangeToMono(this::handleResponse)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create SSAFY account", e);
        }
    }

    public ResponseEntity<Map> depositSSAFYAccount(Map<String, Object> ssafyDepositAccountRequest) {
        try {
            return webClient.post()
                    .uri("/edu/demandDeposit/updateDemandDepositAccountDeposit")
                    .bodyValue(ssafyDepositAccountRequest)
                    .exchangeToMono(this::handleResponse)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Failed to deposit SSAFY account", e);
        }
    }

    private Mono<ResponseEntity<Map>> handleResponse(ClientResponse response) {
        return response.bodyToMono(Map.class)
                .map(body -> ResponseEntity.status(response.statusCode()).body(body));
    }


}
