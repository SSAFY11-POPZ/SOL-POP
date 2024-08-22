package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Image {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "image_id")
  private Integer imageId;

  @Column(name = "image_url")
  private String imageUrl;

  @ManyToOne
  @JoinColumn(name = "store_id", nullable = false)
  @JsonBackReference
  private Store store;

// DTO 사용하는걸 추천
//  @Transient
//  private Integer storeId;  // 직렬화 전용 필드
//
//  public Integer getStoreId() {
//    return this.store != null ? this.store.getStoreId() : null;
//  }



}