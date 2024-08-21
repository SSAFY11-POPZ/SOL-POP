package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.repository.MemberRepository;


@Service
@Transactional
public class MemberService {

  @Autowired
  private MemberRepository memberRepository;
}