package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.EnterRaffle;
import popz.solpop.entity.Member;
import popz.solpop.entity.Raffle;
import popz.solpop.entity.Reservation;

import java.util.List;

@Repository
@Transactional
public interface EnterRaffleRepository extends JpaRepository<EnterRaffle, Integer> {

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN TRUE ELSE FALSE END "
            + "FROM EnterRaffle e WHERE e.raffle = :raffle AND e.member = :member")
    boolean existsByRaffleAndMember(Raffle raffle, Member member);

    @Query("SELECT er FROM EnterRaffle er "
            + "WHERE er.member.memId = :memId "
            + "ORDER BY er.raffle.raffleId DESC")
    List<EnterRaffle.MyRaffle> findMyRaffle(Integer memId);
}