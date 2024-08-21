package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Account;

@Repository
@Transactional
public interface AccountRepository extends JpaRepository<Account, Integer> {


}
