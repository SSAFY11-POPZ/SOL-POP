package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.EnterRaffle;

@Repository
@Transactional
public interface EnterRaffleRepository extends JpaRepository<EnterRaffle, Integer> {


}
