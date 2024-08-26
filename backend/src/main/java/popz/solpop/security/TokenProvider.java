package popz.solpop.security;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import com.nimbusds.jose.*;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

import jakarta.annotation.PostConstruct;
import popz.solpop.entity.Member;


@Service
public class TokenProvider {
    private static String SECURITY_KEY;

    @Value("${jwt.security.key}")
    private String securityKey;

    @PostConstruct
    public void init() {
        SECURITY_KEY = securityKey;
    }

    // JWT 생성 메서드 (액세스 토큰)
    public String createAccessToken(String userId, int duration) {
        return createJwt(userId, duration, "access");
    }

    // JWT 생성 메서드 (리프레시 토큰)
    public String createRefreshToken(String userId, int duration) {
        return createJwt(userId, duration, "refresh");
    }

    // JWT 생성 메서드 (공용)
    private String createJwt(String userId, int duration, String tokenType) {
        try {
            Instant now = Instant.now();
            Instant exprTime = now.plusSeconds(duration);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(userId)
                    .claim("type", tokenType) // 토큰 타입 추가
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exprTime))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claimsSet
            );

            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            return null;
        }
    }
    // JWT 검증 메서드
    public Map<String,Object> validateJwt(String token) {
        try {
            // 서명 확인을 통한 JWT 검증

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes());
            if (signedJWT.verify(verifier)) {
                // 만료시간 확인
                Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
                if (expirationTime != null && expirationTime.before(new Date())) {
                    return null;
                }

                Map<String, Object> tokenData = new HashMap<>();
                tokenData.put("userId", signedJWT.getJWTClaimsSet().getSubject());
                tokenData.put("issuedAt", signedJWT.getJWTClaimsSet().getIssueTime());
                tokenData.put("expiration", expirationTime);

                return tokenData;
            } else {
                // 서명이 유효하지 않은 경우
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    // JWT로부터 Authentication 객체를 생성하는 메서드 추가
    public Authentication getAuthentication(String token) {
        Map<String, Object> tokenData = validateJwt(token);
        if (tokenData == null) {
            return null;
        }

        String userId = (String) tokenData.get("userId");
        Member principal = new Member();  // 권한 리스트는 빈 리스트로 설정
        principal.setUserId(userId);
        return new UsernamePasswordAuthenticationToken(principal, token,  Collections.emptyList());
    }

    public String getUserName(String token) {
        Map<String, Object> tokenData = validateJwt(token);
        if (tokenData == null) {
            return null;
        }

        String email = (String) tokenData.get("userId");
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
        return email.split("@")[0];  // 이메일에서 @ 앞부분을 파싱하여 반환
    }

    public String getUserId(String token) {
        Map<String, Object> tokenData = validateJwt(token);
        if (tokenData == null) {
            return null;
        }
        return (String) tokenData.get("userId");
    }

}

