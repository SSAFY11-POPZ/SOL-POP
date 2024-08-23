    package popz.solpop.repository;


    import jakarta.transaction.Transactional;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.stereotype.Repository;
    import popz.solpop.dto.ReservationCount;
    import popz.solpop.entity.Reservation;

    import java.time.LocalDate;
    import java.util.List;
    import java.util.Objects;

    @Repository
    @Transactional
    public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
        @Query("SELECT new popz.solpop.dto.ReservationCount(r.reserveDate, r.reserveTime, COUNT(r)) "
                + "FROM Reservation r "
                + "WHERE r.store.storeId = :storeId AND r.reserveDate = :date "
                + "GROUP BY r.reserveTime")
        List<ReservationCount> findByStoreAndReserveDate(Integer storeId, LocalDate date);


    }
