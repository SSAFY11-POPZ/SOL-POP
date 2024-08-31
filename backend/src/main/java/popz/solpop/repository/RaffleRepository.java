package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Member;
import popz.solpop.entity.Raffle;
import popz.solpop.entity.Reservation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface RaffleRepository extends JpaRepository<Raffle, Integer> {

    @Query("SELECT raffle FROM Raffle raffle WHERE raffle.raffleStartDate <= :dateTime AND raffle.raffleEndDate >= :dateTime")
    List<Raffle.RaffleCard> findAllByDateTime(LocalDateTime dateTime);

    Optional<Raffle> findRaffleByRaffleId(Integer raffleId);



}
