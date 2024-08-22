package popz.solpop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import popz.solpop.entity.Member;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String accessToken;
    private int accessTokenDuration;
    private String refreshToken;
    private int refreshTokenDuration; // 리프레시 토큰 유효기간 추가
    private Member member;  // User 대신 Member로 변경
}