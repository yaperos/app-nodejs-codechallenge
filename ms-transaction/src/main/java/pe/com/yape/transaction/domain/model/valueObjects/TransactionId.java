package pe.com.yape.transaction.domain.model.valueObjects;

import java.util.Objects;
import java.util.UUID;

public class TransactionId {

    private final UUID value;

    private TransactionId(String value){
        this.value = UUID.fromString(Objects.requireNonNull(value, "Transaction ID cannot be null"));
    }

    public static TransactionId of(String value) {
        return new TransactionId(value);
    }

    public static TransactionId generate() {
        return new TransactionId(UUID.randomUUID().toString());
    }

    public UUID getValue() {
        return value;
    }


}
