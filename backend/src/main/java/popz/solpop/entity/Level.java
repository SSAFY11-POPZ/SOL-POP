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
@Table(name = "level")
public class Level {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "level_id")
  private Integer levelId;

  @Column(name = "level_name")
  private String levelName;

  @Column(name = "level_discount_rate")
  private Integer discountRate;

  @Column(name = "level_benefit")
  private Integer levelBenefit;
}
