package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Store;
import popz.solpop.repository.StoreRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;


@Service
@Transactional
public class StoreService {

  @Autowired
  private StoreRepository storeRepository;

  public List<Store.StoreCard> getTopStoresByHeartCount(int limit) {

    return storeRepository.findTopStoresByHeartCount(limit);
  }

  public List<Store.StoreCard> getTopStoresByReservationCount(int limit) {

    return storeRepository.findTopStoresByReservationCount(limit);
  }

  public List<Store.StoreCard> getRecentStores(int limit) {

    return storeRepository.findRecentStores(limit);
  }

  public List<Store.StoreCard> getStoresByKeyword(String keyword) {

    return storeRepository.findStoresByStoreKeywordContains(keyword);
  }
  public Store.StoreCard get1ByKeyword(String keyword) {
    return storeRepository.findStoresByStoreKeywordContains(keyword).get(0);
  }

  public List<Store> getStoresByDateTime(LocalDateTime dateTime) {

    return storeRepository.findStoresByDateTime(dateTime);
  }

  public List<Store.StoreCard> getAllStores() {
    return storeRepository.findAllByStoreEndDateBefore();
  }

  public List<Store.StoreCard> getStoresByQuery(String query) {

    return storeRepository.findStoreByQuery(query);
  }

  public Store getStoreByStoreId(Integer storeId) {
    return storeRepository.findStoreByStoreId(storeId).orElse(null);
  }
  public int getHeartCountByStoreId(Integer storeId) {
    return storeRepository.countHeartsByStoreId(storeId);
  }
}