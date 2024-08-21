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
@Table(name = "like")
public class Like {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "like_id")
  private Integer likeId;

  @ManyToOne
  @JoinColumn(name = "mem_id", nullable = false)
  private Member member;

  @ManyToOne
  @JoinColumn(name = "store_id", nullable = false)
  private Store store;

}