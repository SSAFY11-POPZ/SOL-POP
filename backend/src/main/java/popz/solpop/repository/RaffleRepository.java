package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Raffle;

@Repository
@Transactional
public interface RaffleRepository extends JpaRepository<Raffle, Integer> {


}
