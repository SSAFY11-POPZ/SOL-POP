package popz.solpop.entity;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "account")
public class Account {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "account_id")
  private Integer accountId;

  @ManyToOne
  @JoinColumn(name = "mem_id", nullable = false)
  private Member member;

  @Column(name = "account_no")
  private String accountNo;

}