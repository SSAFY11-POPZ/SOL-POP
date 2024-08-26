package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.dto.CheckReservation;
import popz.solpop.dto.ReservationCount;
import popz.solpop.dto.ReserveUnavailable;
import popz.solpop.entity.Member;
import popz.solpop.entity.Reservation;
import popz.solpop.entity.Store;
import popz.solpop.repository.MemberRepository;
import popz.solpop.repository.ReservationRepository;
import popz.solpop.repository.StoreRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ReservationService {

  @Autowired
  private ReservationRepository reservationRepository;
  @Autowired
  private StoreRepository storeRepository;
  @Autowired
  private MemberRepository memberRepository;

  public ReserveUnavailable getReserveAvailability(Integer storeId, LocalDate date) {
    Store store = storeRepository.findById(storeId).orElseThrow();
    List<ReservationCount> reservations = reservationRepository.findByStoreAndReserveDate(storeId, date);

    ReserveUnavailable reserveUnavailable = new ReserveUnavailable();
    reserveUnavailable.setReserveDate(date);
    List<LocalTime> unavailableTime = new ArrayList<>();
    for (ReservationCount r : reservations) {
      if (r.getCount() < store.getStoreCapacity()) { // 예약 불가능한 시간대 return
        continue;
      }
      unavailableTime.add(r.getReserveTime());
    }
    reserveUnavailable.setUnavailableTime(unavailableTime);

    return reserveUnavailable;
  }

  public boolean existsByStoreIdAndMemId(Integer storeId, Member member) {
    Store store = storeRepository.findById(storeId).orElseThrow();
    return reservationRepository.existsByStoreAndMember(store, member);
  }

  public CheckReservation checkReservation(Integer storeId, Integer memId) {
    return reservationRepository.checkReservation(storeId, memId);
  }

  public void saveReservation(Integer storeId, Member member, LocalDate reserveDate, LocalTime reserveTime) {
    Store store = storeRepository.findById(storeId).orElseThrow();
    Reservation reservation = new Reservation();
    reservation.setStore(store);
    reservation.setMember(member);
    reservation.setReserveDate(reserveDate);
    reservation.setReserveTime(reserveTime);
    reservationRepository.save(reservation);
  }

  public void deleteReservation(Integer reserveId) {
    reservationRepository.deleteById(reserveId);
  }

  public List<Reservation.MyReservation> getMyReservations(Integer memId) {
    return reservationRepository.findMyReservation(memId);
  }
}
