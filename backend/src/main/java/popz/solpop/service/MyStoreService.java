package popz.solpop.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.dto.CheckReservation;
import popz.solpop.dto.ReservationCount;
import popz.solpop.dto.ReserveUnavailable;
import popz.solpop.entity.*;
import popz.solpop.repository.MyStoreRepository;
import popz.solpop.repository.ReservationRepository;
import popz.solpop.repository.StoreRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class MyStoreService {

  @Autowired
  private ReservationRepository reservationRepository;
  @Autowired
  private StoreRepository storeRepository;
  @Autowired
  private MyStoreRepository myStoreRepository;

  public List<Reservation.ReservationStatic> getReservationStaticByStoreId(Integer storeId) {
    Store store = storeRepository.findById(storeId).orElseThrow(EntityNotFoundException::new);
    return reservationRepository.findReservationsByStore(store);
  }


  public List<MyStore.MyStoreCard> getMyStores(Member member) {
    Integer memId = member.getMemId();
    return myStoreRepository.findAllByMemId(memId);
  }
}
