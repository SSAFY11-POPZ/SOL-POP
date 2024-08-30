package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.geolatte.geom.M;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.PointUse;
import popz.solpop.entity.Member;
import popz.solpop.entity.Point;
import popz.solpop.security.TokenProvider;
import popz.solpop.service.MemberService;
import popz.solpop.service.PointService;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/v1/point")
public class PointController {

    private static final Logger logger = LoggerFactory.getLogger(PointController.class);

    @Autowired
    TokenProvider tokenProvider;
    @Autowired
    MemberService memberService;
    @Autowired
    private PointService pointService;

    ///api/v1/user/point/charge?amount={충전금액}
    @PutMapping("/charge")
    public Integer chargePoint(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer amount
    ) {

        String userName = tokenProvider.getUserName(token.substring(7));
        Member member = memberService.getMemberByUserName(userName);
        Point point = new Point();
        point.setMember(member);
        point.setPointPlace("포인트 충전");
        point.setUseAmount(amount);
        point.setAfterBalance(member.getPointBalance() + amount);
        pointService.savePoint(point);
        return memberService.chargePoint(member, amount);
    }

    @PostMapping("/request")
    public ResponseEntity<?> usePoint(
            @RequestHeader("Authorization") String token,
            @RequestBody PointUse pointUse
    ) {
        String userName = tokenProvider.getUserName(token.substring(7));
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        Member member = memberService.getMemberByUserName(userName);
        try {
            pointService.usePoint(member, pointUse);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

    }
}
