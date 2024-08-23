package popz.solpop.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReserveAvailable {
    private LocalDate reserveDate;
    private LocalTime reserveTime;
}
