package popz.solpop.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "my_store")
public class MyStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "my_store_id")
    private Integer myStoreId;

    @ManyToOne
    @JoinColumn(name = "store_id")
    @JsonManagedReference
    private Store store;

    @ManyToOne
    @JoinColumn(name = "mem_id")
    @JsonManagedReference
    private Member member;

    public interface MyStoreCard {
        Integer getMyStoreId();
        Store.StoreCard getStore();
    }

}
