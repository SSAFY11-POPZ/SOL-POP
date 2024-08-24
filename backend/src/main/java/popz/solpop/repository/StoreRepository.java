package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Member;
import popz.solpop.entity.Store;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface StoreRepository extends JpaRepository<Store, Integer> {

    @Query("SELECT store FROM Store store JOIN store.heartList heartList "
            + "WHERE store.storeEndDate >= NOW() "
            + "GROUP BY store order by COUNT(heartList) DESC")
    List<Store.StoreCard> findTopStoresByHeartCount(int limit);


    //    @Query("SELECT store FROM Store store WHERE store.storeKeyword LIKE %:keyword%")
    List<Store.StoreCard> findStoresByStoreKeywordContains(String keyword);


    @Query("SELECT store FROM Store store WHERE store.storeStartDate <= :dateTime AND store.storeEndDate >= :dateTime")
    List<Store> findStoresByDateTime(LocalDateTime dateTime);

    @Query("SELECT store FROM Store store WHERE store.storeStartDate <= NOW() AND store.storeEndDate >= NOW()")
    List<Store.StoreCard> findAllByStoreEndDateBefore();

    @Query("SELECT store FROM Store store WHERE store.storeName LIKE %:query%")
    List<Store.StoreCard> findStoreByQuery(String query);

    Optional<Store> findStoreByStoreId(Integer storeId);

    @Query("SELECT COUNT(heart) FROM Heart heart WHERE heart.store.storeId = :storeId")
    int countHeartsByStoreId(Integer storeId);
}
