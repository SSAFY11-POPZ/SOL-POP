package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.*;
import popz.solpop.repository.EnterRaffleRepository;

import java.util.List;


@Service
@Transactional
public class EnterRaffleService {

  @Autowired
  private EnterRaffleRepository enterRaffleRepository;

  public boolean existsByRaffleAndMember(Raffle raffle, Member member) {
    return enterRaffleRepository.existsByRaffleAndMember(raffle, member);
  }

  public EnterRaffle saveEnterRaffle(EnterRaffle enterRaffle) {
    return enterRaffleRepository.save(enterRaffle);
  }

  public List<EnterRaffle.MyRaffle> getMyRaffles(Integer memId) {
    return enterRaffleRepository.findMyRaffle(memId);
  }


}