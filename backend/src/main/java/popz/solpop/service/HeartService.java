package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Heart;
import popz.solpop.repository.HeartRepository;


@Service
@Transactional
public class HeartService {

  @Autowired
  private HeartRepository heartRepository;

  public Heart saveHeart(Heart heart) {
    return heartRepository.save(heart);
  }
}