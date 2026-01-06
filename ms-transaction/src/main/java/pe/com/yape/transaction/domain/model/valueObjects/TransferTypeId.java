package pe.com.yape.transaction.domain.model.valueObjects;

import lombok.Getter;

@Getter
public class TransferTypeId {

    private final Integer value;

    private TransferTypeId(Integer value) {
        this.value = value;
    }

    public static TransferTypeId of(Integer value) {
        return new TransferTypeId(value);
    }

}
