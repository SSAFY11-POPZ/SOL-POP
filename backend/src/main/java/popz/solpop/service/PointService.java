package popz.solpop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import popz.solpop.dto.PointUse;
import popz.solpop.entity.Member;
import popz.solpop.entity.Point;
import popz.solpop.repository.PointRepository;

import java.time.LocalDateTime;
import java.util.List;


@Service
@Transactional
public class PointService {

  @Autowired
  private PointRepository pointRepository;

  public List<Point> getMyPointUsageHistory(Integer memId) {
    return pointRepository.findAllByMemId(memId);
  }

  @Transactional
  public void usePoint(Member member, PointUse pointUse) {

    member.setPointBalance(member.getPointBalance() - pointUse.getAmount());
    Point point = new Point();
    point.setPointPlace(pointUse.getPointPlace());
    point.setMember(member);
    point.setPointUsedAt(LocalDateTime.now());
    pointRepository.save(point);
  }
}