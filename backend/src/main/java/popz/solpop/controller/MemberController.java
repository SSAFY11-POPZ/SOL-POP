package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import popz.solpop.dto.MemberId;
import popz.solpop.entity.Heart;
import popz.solpop.entity.Reservation;
import popz.solpop.service.HeartService;
import popz.solpop.service.ReservationService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class MemberController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    @Autowired
    private ReservationService reservationService;
    @Autowired
    private HeartService heartService;

    @GetMapping("/reservation")
    public List<Reservation.MyReservation> getMyReservation(
            @RequestBody MemberId memId
            ) {
        return reservationService.getMyReservations(memId.getMemId());
    }
    @GetMapping("/heart")
    public List<Heart.MyHeart> getMyHeart(
            @RequestBody MemberId memId
    ) {
        return heartService.getMyHeart(memId.getMemId());
    }

}
