package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Point;

@Repository
@Transactional
public interface PointRepository extends JpaRepository<Point, Integer> {


}
