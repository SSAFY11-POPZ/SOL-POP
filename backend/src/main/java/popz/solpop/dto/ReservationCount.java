package popz.solpop.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;


@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationCount {
    private LocalDate reserveDate;
    private LocalTime reserveTime;
    private Long count;
}
