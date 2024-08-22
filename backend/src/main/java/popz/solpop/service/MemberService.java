package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.entity.Member;
import popz.solpop.repository.MemberRepository;


@Service
@Transactional
public class MemberService {

  @Autowired
  private MemberRepository memberRepository;

  public Member getMemberByMemId(Integer memId) {
    return memberRepository.findMemberByMemId(memId).orElse(null);
  }
}