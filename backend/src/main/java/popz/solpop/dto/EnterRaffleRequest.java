package popz.solpop.dto;

import lombok.Data;

@Data
public class EnterRaffleRequest {
    private Integer memId;
    private Integer raffleId;
    private String raffleCrtNo;
}
