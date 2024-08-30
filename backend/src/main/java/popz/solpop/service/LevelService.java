package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Level;
import popz.solpop.repository.LevelRepository;


@Service
@Transactional
public class  LevelService {

  @Autowired
  private LevelRepository levelRepository;

}