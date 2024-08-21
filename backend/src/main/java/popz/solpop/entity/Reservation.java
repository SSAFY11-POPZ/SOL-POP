package popz.solpop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reservation")
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "reserve_id")
  private Integer reserveId;

  @ManyToOne
  @JoinColumn(name = "store_id")
  private Store store;

  @ManyToOne
  @JoinColumn(name = "mem_id")
  private Member member;

  @Column(name = "reserve_date")
  private Date reserveDate;

  @Column(name = "reserve_time")
  private Date reserveTime;

  @Column(name = "is_enter")
  private Boolean isEnter;


}
