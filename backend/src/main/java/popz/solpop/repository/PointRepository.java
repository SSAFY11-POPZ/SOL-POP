package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Point;

import java.util.List;

@Repository
@Transactional
public interface PointRepository extends JpaRepository<Point, Integer> {

    @Query("SELECT p FROM Point p WHERE p.member.memId = :memId ORDER BY p.pointUsedAt DESC")
    List<Point> findAllByMemId(Integer memId);

}
