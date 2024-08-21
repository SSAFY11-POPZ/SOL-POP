package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.repository.ReservationRepository;


@Service
@Transactional
public class ReservationService {

  @Autowired
  private ReservationRepository reservationRepository;
}