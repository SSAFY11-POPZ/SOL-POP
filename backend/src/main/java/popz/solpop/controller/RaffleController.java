package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.EnterRaffleRequest;
import popz.solpop.entity.EnterRaffle;
import popz.solpop.entity.Member;
import popz.solpop.entity.Raffle;
import popz.solpop.service.EnterRaffleService;
import popz.solpop.service.MemberService;
import popz.solpop.service.RaffleService;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/raffle")
public class RaffleController {

    private static final Logger logger = LoggerFactory.getLogger(RaffleController.class);


    @Autowired
    private RaffleService raffleService;
    @Autowired
    private EnterRaffleService enterRaffleService;
    @Autowired
    private MemberService memberService;


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
            @RequestBody EnterRaffleRequest enterRaffleRequest
        ) {

        Member member = memberService.getMemberByMemId(enterRaffleRequest.getMemId());
        Raffle raffle = raffleService.getRaffleByRaffleId(enterRaffleRequest.getRaffleId());
        if (member == null || raffle == null) {
            return ResponseEntity.badRequest().body("Invalid member or raffle");
        }

        if (!raffle.getRaffleCrtNo().equals(enterRaffleRequest.getRaffleCrtNo())) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("raffleCrtNo does not match");
        }


        EnterRaffle enterRaffle = new EnterRaffle();
        enterRaffle.setMember(member);
        enterRaffle.setRaffle(raffle);
        enterRaffleService.saveEnterRaffle(enterRaffle);
        return ResponseEntity.ok().build();
    }


}
