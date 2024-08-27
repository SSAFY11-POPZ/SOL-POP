    package popz.solpop.controller;

    import lombok.extern.slf4j.Slf4j;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import popz.solpop.dto.CheckReservation;
    import popz.solpop.dto.ReserveUnavailable;
    import popz.solpop.dto.StoreDetailResponse;
    import popz.solpop.dto.StoreIdDTO;
    import popz.solpop.entity.Heart;
    import popz.solpop.entity.Member;
    import popz.solpop.entity.Store;
    import popz.solpop.security.TokenProvider;
    import popz.solpop.service.HeartService;
    import popz.solpop.service.MemberService;
    import popz.solpop.service.ReservationService;
    import popz.solpop.service.StoreService;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.LocalTime;
    import java.util.List;
    import java.util.Map;

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
        @Autowired
        private ReservationService reservationService;
        @Autowired
        private TokenProvider tokenProvider;


        @GetMapping("/main/carousel")
        public List<Store.StoreCard> getMainCarousel() {
            return storeService.getTopStoresByHeartCount(5);
        }

        @GetMapping("/main/slide")
        public List<Store.StoreCard> getStoresByKeyword(
                @RequestParam String keyword
        ) {
            if (keyword.equals("전체")) {
                return storeService.getRecentStores(5);
            }
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
        public ResponseEntity<?> getDetailByStoreId(
                @PathVariable Integer storeId,
                @RequestHeader("Authorization") String token

        ) {
            Store store = storeService.getStoreByStoreId(storeId);
            int heartCount = storeService.getHeartCountByStoreId(storeId);
            if (store == null) {
                return ResponseEntity.notFound().build();
            }
            if (token == null || token.equals("")) {
                return ResponseEntity.ok(new StoreDetailResponse(store, heartCount, false));
            } else {
                String userName = tokenProvider.getUserName(token.substring(7));
                Member member = memberService.getMemberByUserName(userName);
                boolean isHearted = heartService.isHearted(member, store);
                return ResponseEntity.ok(new StoreDetailResponse(store, heartCount, isHearted));
            }





        }

        @GetMapping("/search")
        public List<Store.StoreCard> getStoresByQuery(
                @RequestParam String query
        ) {
            return storeService.getStoresByQuery(query);
        }

        @PostMapping("/heart")
        public ResponseEntity<?> addHeart(
                @RequestBody Map<String, Integer> storeIdMap,
                @RequestHeader("Authorization") String token
        ) {

            String userName = tokenProvider.getUserName(token.substring(7));
            Member member = memberService.getMemberByUserName(userName);
            Store store = storeService.getStoreByStoreId(storeIdMap.get("storeId"));

            if (member == null || store == null) {
                return ResponseEntity.badRequest().build();
            }
            boolean isHearted = heartService.isHearted(member, store);
            if (isHearted) {
                heartService.deleteHeart(member, store);
                return ResponseEntity.ok("하트취소");
            }

            Heart heart = new Heart();
            heart.setMember(member);
            heart.setStore(store);
            Heart createdHeart = heartService.saveHeart(heart);

            return ResponseEntity.ok(createdHeart);
        }


        // 예약 현황
        @GetMapping("{storeId}/reserve")
        public ReserveUnavailable getReserveAvailability(
                @PathVariable Integer storeId,
                @RequestParam LocalDate date
        ) {
            return reservationService.getReserveAvailability(storeId, date);
        }

        @PostMapping("/{storeId}/reserve/request")
        public ResponseEntity<?> requestReservation(
                @PathVariable Integer storeId,
                @RequestParam("datetime") LocalDateTime dateTime,
                @RequestHeader("Authorization") String token
        ) {

            LocalDate reserveDate = dateTime.toLocalDate();
            LocalTime reserveTime = dateTime.toLocalTime();
            String userName = tokenProvider.getUserName(token.substring(7));

            Member member = memberService.getMemberByUserName(userName);
            Integer memId = member.getMemId();

            boolean alreadyBooked = reservationService.existsByStoreIdAndMemId(storeId, member);
            if (alreadyBooked) {
                CheckReservation checkReservation = reservationService.checkReservation(storeId, memId);
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Already booked : "
                                + checkReservation.getReserveDate()
                                + "T"
                                + checkReservation.getReserveTime());
            }
            Store store = storeService.getStoreByStoreId(storeId);
            LocalDateTime start = store.getStoreStartDate();
            LocalDateTime end = store.getStoreEndDate();

            if (start.isAfter(dateTime) || end.isBefore(dateTime) || start.toLocalTime().isAfter(reserveTime) || end.toLocalTime().isBefore(reserveTime)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Schedule Cannot Be Reserved");
            }


            reservationService.saveReservation(storeId, member, reserveDate, reserveTime);
            return ResponseEntity.ok().build();
        }



    }
