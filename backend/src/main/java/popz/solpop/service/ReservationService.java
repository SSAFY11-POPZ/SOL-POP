package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.dto.ReservationCount;
import popz.solpop.dto.ReserveAvailable;
import popz.solpop.entity.Reservation;
import popz.solpop.entity.Store;
import popz.solpop.repository.ReservationRepository;
import popz.solpop.repository.StoreRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class ReservationService {

  @Autowired
  private ReservationRepository reservationRepository;
  @Autowired
  private StoreRepository storeRepository;

  public List<ReserveAvailable> getReserveAvailability(Integer storeId, LocalDate date) {
    Store store = storeRepository.findById(storeId).orElseThrow();
    List<ReservationCount> reservations = reservationRepository.findByStoreAndReserveDate(storeId, date);
    List<ReserveAvailable> reserveAvailableList = new ArrayList<>();
    for (ReservationCount r : reservations) {
      if (r.getCount() >= store.getStoreCapacity()) {
        continue;
      }
      ReserveAvailable reserveAvailable = new ReserveAvailable();
      reserveAvailable.setReserveDate(r.getReserveDate());
      reserveAvailable.setReserveTime(r.getReserveTime());
      reserveAvailableList.add(reserveAvailable);
    }
    return reserveAvailableList;
  }
}
