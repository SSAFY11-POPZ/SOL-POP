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
    private String userId;  // mem_user_id에 해당 (이메일)
    @NotBlank
    private String password;  // mem_pw에 해당
}