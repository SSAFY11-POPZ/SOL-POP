package popz.solpop.dto;

import lombok.Data;

@Data
public class SSAFYUserResponse {
    private String userId;
    private String userName;
    private String institutionCode;
    private String userKey;
    private String created;
    private String modified;
}
