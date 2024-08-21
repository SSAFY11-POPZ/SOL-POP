package popz.solpop.entity;

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


  @OneToOne
  @JoinColumn(name = "mem_id")
  private Member member;

  @Column(name = "point_used_at")
  private LocalDateTime pointUsedAt;

  @Column(name = "point_place")
  private String pointPlace;


}
