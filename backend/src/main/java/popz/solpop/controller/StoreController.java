    package popz.solpop.controller;

    import lombok.extern.slf4j.Slf4j;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import popz.solpop.dto.CheckReservation;
    import popz.solpop.dto.HeartRequest;
    import popz.solpop.dto.MemberId;
    import popz.solpop.dto.ReserveUnavailable;
    import popz.solpop.entity.Heart;
    import popz.solpop.entity.Member;
    import popz.solpop.entity.Store;
    import popz.solpop.service.HeartService;
    import popz.solpop.service.MemberService;
    import popz.solpop.service.ReservationService;
    import popz.solpop.service.StoreService;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.LocalTime;
    import java.util.List;

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
        public ResponseEntity<?> getDetailByStoreId(
                @PathVariable Integer storeId
        ) {
            Store store = storeService.getStoreByStoreId(storeId);
            if (store == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(store);
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
                @RequestBody MemberId memberId
        ) {
            LocalDate reserveDate = dateTime.toLocalDate();
            LocalTime reserveTime = dateTime.toLocalTime();
            Integer memId = memberId.getMemId();


            boolean alreadyBooked = reservationService.existsByStoreIdAndMemId(storeId, memId);
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


            reservationService.saveReservation(storeId, memId, reserveDate, reserveTime);
            return ResponseEntity.ok().build();
        }

    }
