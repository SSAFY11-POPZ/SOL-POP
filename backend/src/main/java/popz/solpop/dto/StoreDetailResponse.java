package popz.solpop.dto;

import lombok.Data;
import popz.solpop.entity.Store;

@Data
public class StoreDetailResponse {
    private Store store;
    private int heartCount;

    public StoreDetailResponse(Store store, int heartCount) {
        this.store = store;
        this.heartCount = heartCount;
    }

    // Getters and setters
}