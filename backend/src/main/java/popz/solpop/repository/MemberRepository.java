package popz.solpop.repository;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import popz.solpop.entity.Member;

@Repository
@Transactional
public interface MemberRepository extends JpaRepository<Member, String> {

    boolean existsByUserName(String userName);  // 메서드 정의

    @Query("SELECT member FROM Member member WHERE member.userName = :userName")
    Member findMemberByUserName(@Param("userName") String userName);}
