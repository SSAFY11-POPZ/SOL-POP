package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Level;

@Repository
@Transactional
public interface LevelRepository extends JpaRepository<Level, Integer> {


}
