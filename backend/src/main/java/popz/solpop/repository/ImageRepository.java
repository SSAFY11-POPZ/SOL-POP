package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import popz.solpop.entity.Image;

@Repository
@Transactional
public interface ImageRepository extends JpaRepository<Image, Integer> {


}
