package popz.solpop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "mem_id")
  private Integer memberId;

  @Column(name = "mem_user_name") // SSAFY 금융 API // 로그인 할 때 쓰는 아이디
  private String userName;

  @Column(name = "mem_pw")
  private String password;

  @Column(name = "mem_name")
  private String name;

  @Column(name = "is_account_link")
  private Boolean isAccountLink;

  @Column(name = "token")
  private String token;


  @Column(name = "mem_created_at")
  private LocalDateTime createdAt;

  @Column(name = "mem_edited_at")
  private LocalDateTime editedAt;

  @Column(name = "mem_last_login_at")
  private LocalDateTime lastLoginAt;

  @Column(name = "mem_user_id")  // SSAFY 금융 API // 이메일
  private String userId;

  @Column(name = "user_key") // SSAFY 금융 API
  private String userKey;


  @ManyToOne
  @JoinColumn(name = "level_id")
  private Level level;





  // 참조
  @OneToMany(mappedBy = "member")
  private List<EnterRaffle> enterRaffleList;

  @OneToMany(mappedBy = "member")
  private List<Like> likeList;

  @OneToMany(mappedBy = "member")
  private List<Reservation> reservationList;

  @OneToMany(mappedBy = "member")
  private List<Account> accountList;

  @OneToOne(mappedBy = "member")
  private Point point;
}
