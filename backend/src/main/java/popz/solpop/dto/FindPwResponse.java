package popz.solpop.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FindPwResponse {
    private String address;
    private String title;
    private String message;
}