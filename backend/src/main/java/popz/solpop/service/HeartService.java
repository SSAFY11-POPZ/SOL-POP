package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Heart;
import popz.solpop.entity.Member;
import popz.solpop.entity.Reservation;
import popz.solpop.entity.Store;
import popz.solpop.repository.HeartRepository;
import popz.solpop.repository.StoreRepository;

import java.util.List;


@Service
@Transactional
public class HeartService {

  @Autowired
  private HeartRepository heartRepository;
  @Autowired
  private StoreRepository storeRepository;

  public boolean isHearted(Member member, Store store) {
    return heartRepository.existsByMemberAndStore(member, store);
  }
  public Heart saveHeart(Heart heart) {
    return heartRepository.save(heart);
  }

  public void deleteHeart(Member member, Store store) {
    Integer heartId = heartRepository.findHeartId(member.getMemId(), store.getStoreId());
    heartRepository.deleteById(heartId);
  }

  public List<Heart.MyHeart> getMyHeart(Integer memId) {
    return heartRepository.findMyHeart(memId);
  }
}