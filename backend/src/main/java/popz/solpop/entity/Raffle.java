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
@Table(name = "raffle")
public class Raffle {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer raffleId;

  @Column(name = "raffle_start_date")
  private LocalDateTime raffleStartDate;

  @Column(name = "raffle_end_date")
  private LocalDateTime raffleEndDate;

  @Column(name = "raffle_qual")
  private String raffleQual;

  @Column(name = "raffle_detail")
  private String raffleDetail;

  @Column(name = "raffle_price")
  private long rafflePrice;

  @Column(name = "raffle_crt_no")
  private String raffleCrtNo;

  @Column(name = "raffle_num_winners")
  private long raffleNumWinners;

  @OneToOne
  @JoinColumn(name = "store_id")
  private Store store;


  // 참조
  @OneToMany(mappedBy = "raffle")
  private List<EnterRaffle> enterRaffleList;
}
