package popz.solpop.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUp {
    private String userName;  // mem_user_name
    private String password;  // mem_pw
    private String name;      // mem_name
    private String userId;    // mem_user_id
    private String token;
    private Boolean isAccountLink;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private LocalDateTime lastLoginAt;
    private Integer levelId;

}
