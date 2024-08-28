package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

  @Column(name = "raffle_name")
  private String raffleName;

  @Column(name = "raffle_start_date")
  private LocalDateTime raffleStartDate;

  @Column(name = "raffle_end_date")
  private LocalDateTime raffleEndDate;

  @Column(name = "raffle_qual")
  private String raffleQual;

  @Column(name = "raffle_detail")
  private String raffleDetail;

  @Column(name = "raffle_thumbnail_url")
  private String raffleThumbnailUrl;

  @Column(name = "raffle_price")
  private long rafflePrice;

  @Column(name = "raffle_crt_no")
  private String raffleCrtNo;

  @Column(name = "raffle_num_winners")
  private long raffleNumWinners;

  @OneToOne
  @JoinColumn(name = "store_id")
  @JsonManagedReference
  private Store store;


  // 참조
  @OneToMany(mappedBy = "raffle")
  @JsonBackReference
  private List<EnterRaffle> enterRaffleList;


  public interface RaffleCard {
    Integer getRaffleId();

    String getRaffleName();

    String getRaffleThumbnailUrl();

    Integer getRafflePrice();

    Integer getRaffleNumWinners();
  }


}
