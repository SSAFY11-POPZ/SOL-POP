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
public class Store {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "store_id")
  private Integer id;

  @Column(name = "store_name")
  private String storeName;

  @Column(name = "store_start_date")
  private LocalDateTime storeStartDate;

  @Column(name = "store_end_date")
  private LocalDateTime storeEndDate;

  @Column(name = "store_place")
  private String storePlace;

  @Column(name = "store_detail")
  private String storeDetail;

  @Column(name = "store_keyword")
  private String storeKeyword;

  @Column(name = "store_rsv_priority")
  private boolean storeRsvPriority;

  @Column(name = "store_capacity")
  private Integer storeCapacity;

  @Column(name = "store_thumnail_url")
  private String thumnailUrl;

  @Column(name = "store_price")
  private Integer storePrice;

  @Column(name = "store_hashtag")
  private String hashtag;


  // 참조
  @OneToMany(mappedBy = "store")
  private List<Image> imageList;

  @OneToMany(mappedBy = "store")
  private List<Reservation> reservationList;

  @OneToOne(mappedBy = "store")
  private Raffle raffle;

}
