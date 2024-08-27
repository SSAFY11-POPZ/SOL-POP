    package popz.solpop.repository;


    import jakarta.transaction.Transactional;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Modifying;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;
    import popz.solpop.dto.CheckReservation;
    import popz.solpop.dto.ReservationCount;
    import popz.solpop.entity.Member;
    import popz.solpop.entity.Reservation;
    import popz.solpop.entity.Store;

    import java.time.LocalDate;
    import java.util.List;

    @Repository
    @Transactional
    public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
        @Query("SELECT new popz.solpop.dto.ReservationCount(r.reserveDate, r.reserveTime, COUNT(r)) "
                + "FROM Reservation r "
                + "WHERE r.store.storeId = :storeId AND r.reserveDate = :date "
                + "GROUP BY r.reserveTime")
        List<ReservationCount> findByStoreAndReserveDate(Integer storeId, LocalDate date);

        boolean existsByStoreAndMember(Store store, Member member);


        @Query("SELECT new popz.solpop.dto.CheckReservation(r.store.storeId, r.member.memId, r.reserveDate, r.reserveTime) " +
                "FROM Reservation r WHERE r.store.storeId = :storeId AND r.member.memId = :memId")
        CheckReservation checkReservation(Integer storeId, Integer memId);

        @Query("SELECT r FROM Reservation r "
                + "WHERE r.member.memId = :memId AND r.store.storeEndDate >= NOW()"
                + "ORDER BY r.reserveDate DESC, r.reserveTime DESC")
        List<Reservation.MyReservation> findMyReservation(Integer memId);

        @Modifying
        @Transactional
        @Query("UPDATE Reservation r SET r.isVisited = :isVisited WHERE r.store.storeId = :storeId AND r.member.memId = :memId")
        int updateIsVisited(@Param("isVisited") boolean isVisited, @Param("storeId") Integer storeId, @Param("memId") Integer memId);

    }
