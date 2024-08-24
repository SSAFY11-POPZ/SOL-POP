package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "heart")
public class Heart {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "heart_id")
  private Integer heartId;

  @ManyToOne
  @JoinColumn(name = "mem_id", nullable = false)
  @JsonManagedReference
  private Member member;

  @ManyToOne
  @JoinColumn(name = "store_id", nullable = false)
  @JsonManagedReference
  private Store store;

  public interface MyHeart {
    StoreInfo getStore();

    interface StoreInfo {
      Integer getStoreId();
      String getStoreName();
      String getStorePlace();
    }
  }


}