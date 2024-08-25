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
}