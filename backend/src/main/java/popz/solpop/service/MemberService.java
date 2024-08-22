package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.dto.SignUp;
import popz.solpop.entity.Level;
import popz.solpop.entity.Member;
import popz.solpop.repository.LevelRepository;
import popz.solpop.repository.MemberRepository;

import java.time.LocalDateTime;


@Service
@Transactional
public class MemberService {

  @Autowired
  private MemberRepository memberRepository;

  public Member getMemberByMemId(Integer memId) {
    return memberRepository.findMemberByMemId(memId).orElse(null);
  }

  @Autowired
  private LevelRepository levelRepository;



  public void signUp(SignUp signUpDto) {
    Level level = levelRepository.findById(signUpDto.getLevelId())
            .orElseThrow();

    Member member = Member.builder()
            .userName(signUpDto.getUserName())
            .password(signUpDto.getPassword())
            .name(signUpDto.getName())
            .userId(signUpDto.getUserId())
            .token(signUpDto.getToken())
            .isAccountLink(signUpDto.getIsAccountLink())
            .createdAt(LocalDateTime.now())
            .editedAt(LocalDateTime.now())
            .level(level)
            .build();

    memberRepository.save(member);
  }
}