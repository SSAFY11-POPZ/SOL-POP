package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Reservation;

@Repository
@Transactional
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {


}
