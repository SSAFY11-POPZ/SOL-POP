package popz.solpop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Login {
    @NotBlank
    private String userName;  // mem_user_name에 해당
    @NotBlank
    private String password;  // mem_pw에 해당
    @NotBlank
    private String userType;  // 사용자 유형(이 부분은 엔티티에서 따로 정의되어 있지 않지만, 필요에 따라 필드 추가 가능)
}