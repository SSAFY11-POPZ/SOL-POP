package popz.solpop.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;


@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class PopUpStoreAd {

  @Id
  private long adRequestNo;
  private String adRequestBrand;
  private java.sql.Date adRequestDate;
  private String adRequestDetail;


}
