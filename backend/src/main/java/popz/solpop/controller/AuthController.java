package popz.solpop.controller;


import lombok.extern.slf4j.Slf4j;
import popz.solpop.dto.*;
import popz.solpop.entity.Account;
import popz.solpop.repository.AccountRepository;
import popz.solpop.security.TokenProvider;
import popz.solpop.repository.MemberRepository;
import popz.solpop.service.AuthService;
import popz.solpop.entity.Member;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import popz.solpop.service.MailService;
import popz.solpop.service.MemberService;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {
    @Autowired
    AuthService authService;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    TokenProvider tokenProvider;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    private MemberService memberService;
    @Autowired
    private MailService mailService;

    @GetMapping("/check-id")
    public Response<?> checkId(@RequestParam String userName) {
        boolean exists = memberRepository.existsByUserName(userName);
        if (exists) {
            return Response.setFailed("중복되는 아이디가 존재합니다.");
        } else {
            return Response.setSuccess("사용 가능한 아이디입니다.");
        }
    }

    @PostMapping("/signUp")
    public Response<?> signUp(@RequestBody SignUp requestBody) {
        Response<?> result = authService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public Response<?> login(@RequestBody Login requestBody, HttpServletResponse response) {
        Response<?> result = authService.login(requestBody, response);
        return result;
    }

    @PostMapping("/logout")
    public Response<?> logout(HttpServletResponse response) {
        // Refresh Token 쿠키 제거
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 적용
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 쿠키 즉시 만료
        response.addCookie(refreshTokenCookie);
        return Response.setSuccess("로그아웃에 성공했습니다.");
    }

    // 유저 계좌, 유저 키, 이메일, 이름 포함 전달하기
    @GetMapping("/check-token")
    public Response<?> checkToken(@RequestHeader("Authorization") String token) {
        token = token.substring(7);

        Map<String, Object> tokenData = tokenProvider.validateJwt(token);
        if (tokenData == null) {
            return Response.setFailed("엑세스토큰이 유효하지 않습니다.");
        }

        String userId = (String) tokenData.get("userId");
        Member member = memberRepository.findMemberByUserId(userId);

        if (member == null) {
            return Response.setFailed("유효하지 않은 사용자입니다.");
        }

        Account account = accountRepository.findByMember(member);
        if (account == null) {
            return Response.setFailed("사용자의 계좌 정보를 찾을 수 없습니다.");
        }

        Date issuedAt = (Date) tokenData.get("issuedAt");
        long elapsedSeconds = (new Date().getTime() - issuedAt.getTime()) / 1000;
        int accessTokenDuration = 7200;

        if (elapsedSeconds > accessTokenDuration) {
            return Response.setFailed("엑세스토큰이 만료되었습니다.");
        }

        Map<String, Object> responseData = Map.of(
                "userId", member.getUserId(),
                "userKey", member.getUserKey(),
                "Name", member.getName(),
                "accountNo", account.getAccountNo()
        );

        try {
            return Response.setSuccessData("엑세스토큰이 유효합니다",responseData);
        } catch (Exception e) {
            return Response.setFailed("응답 데이터를 처리하는 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/refresh-token")
    public Response<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("cookies : {}", request.getCookies());
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return Response.setFailed("리프레시 토큰이 존재하지 않습니다.");
        }

        Map<String, Object> tokenData = tokenProvider.validateJwt(refreshToken);
        if (tokenData == null) {
            return Response.setFailed("리프레시 토큰이 유효하지 않습니다.");
        }

        String userName = (String) tokenData.get("userName");

        Member memberEntity = memberRepository.findMemberByUserName(userName);
        if (memberEntity == null || !memberEntity.getToken().equals(refreshToken)) {
            return Response.setFailed("리프레시 토큰이 유효하지 않습니다.");
        }

        int accessTokenDuration = 7200;
        String newAccessToken = tokenProvider.createAccessToken(userName, accessTokenDuration);

        if (newAccessToken == null) {
            return Response.setFailed("엑세스토큰 생성에 실패했습니다.");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", newAccessToken);

        return Response.setSuccessData("엑세스토큰 재발급에 성공하였습니다.", data);
    }

    @GetMapping("/check/findPassword")
    public Boolean findPassword(
            @RequestBody FindPwRequest findPwRequest){
        return memberService.userEmailCheck(findPwRequest.getUserId(), findPwRequest.getName());
    }


    @PostMapping("/check/findPassword/sendEmail")
    public void sendEmail(
            @RequestBody FindPwRequest findPwRequest
    ){
        FindPwResponse findPwResponse = mailService.createMailAndChangePassword(findPwRequest.getUserId(), findPwRequest.getName());
        mailService.mailSend(findPwResponse);
    }

    // 싸피 사용자 계정 생성
    @PostMapping("/createSSAFYUser")
    public ResponseEntity<Map> postCreateSSAFYUser(
            @RequestBody Map<String,Object> ssafyUserCreateRequest)  {
        return authService.createSSAFYUser(ssafyUserCreateRequest);
    }

    // 싸피 사용자 계정 조회
    @PostMapping("/checkSSAFYUser")
    public ResponseEntity<Map> postCheckSSAFYUser(
            @RequestBody Map<String,Object> ssafyUserCheckRequest)  {
        return authService.checkSSAFYUser(ssafyUserCheckRequest);
    }

    // 싸피 계좌 생성
    @PostMapping("/createSSAFYAccount")
    public ResponseEntity<Map> postCreateSSAFYAccount(
            @RequestBody Map<String,Object> ssafyCreateAccountRequest)  {
        return authService.createSSAFYAccount(ssafyCreateAccountRequest);
    }

    // 싸피 계좌 입금
    @PostMapping("/depositSSAFYAccount")
    public ResponseEntity<Map> postDepositSSAFYAccount(
            @RequestBody Map<String,Object> ssafyDepositAccountRequest)  {
        return authService.depositSSAFYAccount(ssafyDepositAccountRequest);
    }

}

