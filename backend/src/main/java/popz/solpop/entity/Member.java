package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "member")
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "mem_id")
  private Integer memId;

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

  @Column(name = "point_balance, nullable = false")
  private Integer pointBalance;

  @PrePersist
  public void prePersist() {
    this.pointBalance = this.pointBalance != null ? this.pointBalance : 0;
  }


  @ManyToOne
  @JoinColumn(name = "level_id")
  @JsonManagedReference
  private Level level;





  // 참조
  @OneToMany(mappedBy = "member")
  @JsonBackReference
  private List<EnterRaffle> enterRaffleList;

  @OneToMany(mappedBy = "member")
  @JsonBackReference
  private List<Heart> heartList;

  @OneToMany(mappedBy = "member")
  @JsonBackReference
  private List<Reservation> reservationList;

  @OneToMany(mappedBy = "member")
  @JsonBackReference
  private List<Account> accountList;

  @OneToMany(mappedBy = "member")
  @JsonBackReference
  private List<Point> pointList;




}
