package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.repository.StoreRepository;


@Service
@Transactional
public class StoreService {

  @Autowired
  private StoreRepository storeRepository;
}