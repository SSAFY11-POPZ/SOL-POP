package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Heart;
import popz.solpop.entity.Reservation;
import popz.solpop.repository.HeartRepository;

import java.util.List;


@Service
@Transactional
public class HeartService {

  @Autowired
  private HeartRepository heartRepository;

  public Heart saveHeart(Heart heart) {
    return heartRepository.save(heart);
  }

  public List<Heart.MyHeart> getMyHeart(Integer memId) {
    return heartRepository.findMyHeart(memId);
  }
}