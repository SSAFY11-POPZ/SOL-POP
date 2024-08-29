package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import popz.solpop.entity.Member;
import popz.solpop.entity.Reservation;
import popz.solpop.security.TokenProvider;
import popz.solpop.service.MemberService;
import popz.solpop.service.ReservationService;

@Slf4j
@RestController
@RequestMapping("/api/v1/reserve")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @Autowired
    ReservationService reservationService;
    @Autowired
    MemberService memberService;
    @Autowired
    TokenProvider tokenProvider;


    @PostMapping("/{storeId}/confirm-visit")
    public ResponseEntity<?> confirmVisit(
            @PathVariable Integer storeId,
            @RequestHeader("Authorization") String token
    ) {

        try {
            // 토큰에서 사용자 이름 추출
            String userName = tokenProvider.getUserName(token.substring(7));
            logger.debug("Extracted username: {}", userName);

            // 사용자 정보 가져오기
            Member member = memberService.getMemberByUserName(userName);
            if (member == null) {
                logger.error("Member not found for username: {}", userName);
                return ResponseEntity.status(404).body("Member not found");
            }
            Integer memId = member.getMemId();
            logger.debug("Found member with ID: {}", memId);

            // 방문 여부를 업데이트
            reservationService.updateIsVisited(storeId, memId, true);

            // 성공 메시지 반환
            logger.info("Visit confirmed for storeId: {} and memId: {}", storeId, memId);
            return ResponseEntity.ok("Visit confirmed");

        } catch (Exception e) {
            logger.error("Error confirming visit", e);
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
    }

