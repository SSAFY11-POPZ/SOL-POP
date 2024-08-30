package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "point")
public class Point {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "point_id")
  private Integer pointId;

  @ManyToOne
  @JoinColumn(name = "mem_id")
  @JsonBackReference
  private Member member;

  @Column(name = "point_used_at")
  private LocalDateTime pointUsedAt;

  @Column(name = "point_place")
  private String pointPlace;

  @Column(name = "use_amount")
  private Integer useAmount;

  @Column(name = "after_balance")
  private Integer afterBalance;

  @PrePersist
  public void prePersist() {
      this.pointUsedAt = LocalDateTime.now();
  }

}
