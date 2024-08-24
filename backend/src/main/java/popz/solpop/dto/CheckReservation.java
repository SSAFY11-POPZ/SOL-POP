package popz.solpop.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckReservation {
    private Integer storeId;
    private Integer memId;
    private LocalDate reserveDate;
    private LocalTime reserveTime;
}