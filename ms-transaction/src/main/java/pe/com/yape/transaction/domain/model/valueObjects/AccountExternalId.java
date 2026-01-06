package pe.com.yape.transaction.domain.model.valueObjects;

import lombok.Getter;

import java.util.Objects;
import java.util.UUID;

@Getter
public class AccountExternalId {

    private final UUID value;

    private AccountExternalId(String value) {
        this.value = UUID.fromString(Objects.requireNonNull(value, "Account External ID cannot be null"));
    }

    public static AccountExternalId of(String value) {
        return new AccountExternalId(value);
    }


}
