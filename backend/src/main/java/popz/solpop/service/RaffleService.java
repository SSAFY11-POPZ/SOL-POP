package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Member;
import popz.solpop.entity.Raffle;
import popz.solpop.repository.RaffleRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class RaffleService {

  @Autowired
  private RaffleRepository raffleRepository;

  public List<Raffle.RaffleCard> getAllRaffles() {
    return raffleRepository.findAllByDateTime(LocalDateTime.now());
  }

  public Raffle getRaffleByRaffleId(Integer raffleId) {
    return raffleRepository.findRaffleByRaffleId(raffleId).orElse(null);
  }

}