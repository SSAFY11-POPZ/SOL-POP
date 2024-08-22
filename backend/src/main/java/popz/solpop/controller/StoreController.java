package popz.solpop.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import popz.solpop.dto.HeartRequest;
import popz.solpop.entity.Heart;
import popz.solpop.entity.Member;
import popz.solpop.entity.Raffle;
import popz.solpop.entity.Store;
import popz.solpop.service.HeartService;
import popz.solpop.service.MemberService;
import popz.solpop.service.StoreService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/store")
public class StoreController {

    private static final Logger logger = LoggerFactory.getLogger(StoreController.class);

    @Autowired
    private StoreService storeService;
    @Autowired
    private HeartService heartService;
    @Autowired
    private MemberService memberService;


    @GetMapping("/main/carousel")
    public List<Store.StoreCard> getMainCarousel() {
        return storeService.getTopStoresByHeartCount(5);
    }

    @GetMapping("/main/slide")
    public List<Store.StoreCard> getStoresByKeyword(
            @RequestParam String keyword
    ) {
        return storeService.getStoresByKeyword(keyword);
    }

    @GetMapping("/top10")
    public List<Store.StoreCard> getTop10Stores() {
        return storeService.getTopStoresByHeartCount(10);
    }


    @GetMapping("/calendar")
    public List<Store> getStoresByDate(
            @RequestParam LocalDate date
    ) {
        return storeService.getStoresByDateTime(date.atStartOfDay());
    }


    @GetMapping("/list")
    public List<Store.StoreCard> getAllStores() {
        return storeService.getAllStores();
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<Store> getStoreByStoreId(
            @PathVariable Integer storeId
    ) {
        return ResponseEntity.ok(storeService.getStoreByStoreId(storeId));
    }

    @GetMapping("/search")
    public List<Store.StoreCard> getStoresByQuery(
            @RequestParam String query
    ) {
        return storeService.getStoresByQuery(query);
    }

    @PostMapping("/heart")
    public ResponseEntity<?> addHeart(
            @RequestBody HeartRequest heartRequest
    ) {

        Member member = memberService.getMemberByMemId(heartRequest.getMemId());
        Store store = storeService.getStoreByStoreId(heartRequest.getStoreId());

        if (member == null || store == null) {
            return ResponseEntity.badRequest().build();
        }

        Heart heart = new Heart();
        heart.setMember(member);
        heart.setStore(store);
        Heart createdHeart = heartService.saveHeart(heart);

        return ResponseEntity.ok(createdHeart);
    }



}
