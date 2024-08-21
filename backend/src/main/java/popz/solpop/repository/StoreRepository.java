package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Store;

import java.util.List;

@Repository
@Transactional
public interface StoreRepository extends JpaRepository<Store, Integer> {



}
