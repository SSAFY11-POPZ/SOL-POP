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
public class PopUpStoreEvent {

  @Id
  private String popUpStoreEventNo;
  private String popUpStoreEventQualification;
  private String popUpStoreEventDetail;


}
