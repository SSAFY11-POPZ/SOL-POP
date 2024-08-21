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
@Table(name = "enter_raffle")
public class EnterRaffle {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "enter_id")
  private long enterId;

  @ManyToOne
  @JoinColumn(name = "mem_id")
  private Member member;

  @ManyToOne
  @JoinColumn(name = "raffle_id")
  private Raffle raffle;


}
