    package popz.solpop.repository;


    import jakarta.transaction.Transactional;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Modifying;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;
    import popz.solpop.dto.CheckReservation;
    import popz.solpop.dto.ReservationCount;
    import popz.solpop.entity.*;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.List;

    @Repository
    @Transactional
    public interface MyStoreRepository extends JpaRepository<MyStore, Integer> {

        @Query("SELECT ms FROM MyStore ms WHERE ms.member.memId = :memId")
        List<MyStore.MyStoreCard> findAllByMemId(Integer memId);
    }
