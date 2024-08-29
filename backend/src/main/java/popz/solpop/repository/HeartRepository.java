package popz.solpop.repository;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Heart;
import popz.solpop.entity.Member;
import popz.solpop.entity.Reservation;
import popz.solpop.entity.Store;

import java.util.List;

@Repository
@Transactional
public interface HeartRepository extends JpaRepository<Heart, Integer> {


    @Query("SELECT h FROM Heart h "
            + "WHERE h.member.memId = :memId AND h.store.storeEndDate >= NOW()")
    List<Heart.MyHeart> findMyHeart(Integer memId);

    @Query("SELECT h.heartId FROM Heart h "
            + "WHERE h.member.memId = :memId AND h.store.storeId = :storeId")
    Integer findHeartId(Integer memId, Integer storeId);

    boolean existsByMemberAndStore(Member member, Store store);

}
