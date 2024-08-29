package popz.solpop.dto;

import lombok.Data;
import popz.solpop.entity.Store;

@Data
public class StoreDetailResponse {
    private Store store;
    private int heartCount;
    private boolean isHearted;

    public StoreDetailResponse(Store store, int heartCount, boolean isHearted) {
        this.store = store;
        this.heartCount = heartCount;
        this.isHearted = isHearted;
    }

    // Getters and setters
}