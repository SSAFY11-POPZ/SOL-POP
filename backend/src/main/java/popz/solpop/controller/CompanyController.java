package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.StoreDetailResponse;
import popz.solpop.entity.Member;
import popz.solpop.entity.MyStore;
import popz.solpop.entity.Reservation;
import popz.solpop.entity.Store;
import popz.solpop.security.TokenProvider;
import popz.solpop.service.MemberService;
import popz.solpop.service.MyStoreService;
import popz.solpop.service.StoreService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/company")
@Slf4j
public class CompanyController {

    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private MemberService memberService;
    @Autowired
    private MyStoreService myStoreService;
    @Autowired
    private StoreService storeService;

    @GetMapping("/myStore")
    public ResponseEntity<?> getMyStore(
            @RequestHeader("Authorization") String token
    ) {
        String userName = tokenProvider.getUserName(token.substring(7));
        Member member = memberService.getMemberByUserName(userName);
        if (member == null) {
            return ResponseEntity.badRequest().build();
        }

        List<MyStore.MyStoreCard> myStoreList = myStoreService.getMyStores(member);
        return ResponseEntity.ok(myStoreList);
    }

    @GetMapping("/static/{storeId}")
    public ResponseEntity<?> getStatic(
            @PathVariable Integer storeId,
            @RequestHeader("Authorization") String token
    ) {
        String userName = tokenProvider.getUserName(token.substring(7));
        Member member = memberService.getMemberByUserName(userName);
        Store store = storeService.getStoreByStoreId(storeId);
        if (member == null || store == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Reservation.ReservationStatic> reservationList = myStoreService.getReservationsByStoreId(storeId);
        return ResponseEntity.ok(reservationList);
    }
}



