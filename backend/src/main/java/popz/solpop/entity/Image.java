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
public class Image {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "image_id")
  private Integer imageId;

  @ManyToOne
  @JoinColumn(name = "store_id", nullable = false)
  private Store store;

  @Column(name = "image_url")
  private String imageUrl;

}
