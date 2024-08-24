package popz.solpop.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ReserveUnavailable {
    private LocalDate reserveDate;
    private List<LocalTime> unavailableTime;
}
