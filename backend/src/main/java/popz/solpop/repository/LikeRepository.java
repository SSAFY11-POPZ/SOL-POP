package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Heart;

@Repository
@Transactional
public interface LikeRepository extends JpaRepository<Heart, Integer> {


}
