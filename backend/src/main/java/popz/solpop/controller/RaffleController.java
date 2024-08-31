package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.CheckReservation;
import popz.solpop.dto.EnterRaffleRequest;
import popz.solpop.dto.PointUse;
import popz.solpop.entity.*;
import popz.solpop.security.CouponNumber;
import popz.solpop.security.TokenProvider;
import popz.solpop.service.*;

import java.util.List;
import java.util.Optional;
import java.util.zip.CRC32;

@Slf4j
@RestController
@RequestMapping("/api/v1/raffle")
public class
RaffleController {

    private static final Logger logger = LoggerFactory.getLogger(RaffleController.class);


    @Autowired
    private RaffleService raffleService;
    @Autowired
    private EnterRaffleService enterRaffleService;
    @Autowired
    private MemberService memberService;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private PointService pointService;


    @GetMapping("")
    public List<Raffle.RaffleCard> getAllRaffles() {
        return raffleService.getAllRaffles();
    }

    @GetMapping("/{raffleId}")
    public ResponseEntity<Raffle> getRaffleById(
            @PathVariable Integer raffleId
    ) {
        return ResponseEntity.ok(raffleService.getRaffleByRaffleId(raffleId));
    }


    @PostMapping("/request")
    public ResponseEntity<?> enterRaffle(
            @RequestHeader("Authorization") String token,
            @RequestBody EnterRaffleRequest enterRaffleRequest
    ) {
        String userName;
        try {
            userName = tokenProvider.getUserName(token.substring(7));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e + "Invalid token");
        }
        System.out.println(userName);
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        Member member;
        Raffle raffle;
        try {
            member = memberService.getMemberByUserName(userName);
            raffle = raffleService.getRaffleByRaffleId(enterRaffleRequest.getRaffleId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e + "Invalid member or raffle");
        }

        System.out.println(member);
        System.out.println(raffle);
        if (member == null) {
            return ResponseEntity.badRequest().body("Invalid member ");
        }
        if (raffle == null) {
            return ResponseEntity.badRequest().body("Invalid raffle");
        }


        boolean alreadyEntered = enterRaffleService.existsByRaffleAndMember(raffle, member);
        if (alreadyEntered) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("이미 응모한 래플입니다.");
        }

        boolean reserved = reservationService.existsByStoreIdAndMemId(raffle.getStore().getStoreId(), member);
        if (!reserved) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("예약 후 이용 가능한 서비스 입니다.");
        }

        // CRC32
        CouponNumber generator = new CouponNumber();
        String crtNo = generator.generateCoupon(userName + enterRaffleRequest.getRaffleId());
        String inputCrtNo = enterRaffleRequest.getRaffleCrtNo().replace("-", "").substring(1, 9);
        if (!crtNo.equals(inputCrtNo)) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("잘못된 응모번호 입니다. 다시 입력해주세요.");
        }
        boolean enoughBalance = member.getPointBalance() >= raffle.getRafflePrice();
        if (!enoughBalance) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("포인트가 부족합니다.");
        }

        Point point = new Point();
        Reservation reservation;
        EnterRaffle enterRaffle;
        try {
            point.setMember(member);
            point.setPointPlace(raffle.getRaffleName() + " 래플 응모");

            point.setUseAmount(raffle.getRafflePrice());
            point.setAfterBalance(member.getPointBalance() - 100);
            reservation = reservationService.findReservationByStoreAndMember(raffle.getStore(), member);
            reservation.setIsEnter(true);
            enterRaffle = new EnterRaffle();
            enterRaffle.setMember(member);
            enterRaffle.setRaffle(raffle);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("래플 요청에 실패했습니다.");
        }
        pointService.savePoint(point);
        enterRaffleService.saveEnterRaffle(enterRaffle);

        return ResponseEntity.ok().build();
    }


}
