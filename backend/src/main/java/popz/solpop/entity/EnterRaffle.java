package popz.solpop.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
  @JsonManagedReference
  private Member member;

  @ManyToOne
  @JoinColumn(name = "raffle_id")
  @JsonManagedReference
  private Raffle raffle;


}
