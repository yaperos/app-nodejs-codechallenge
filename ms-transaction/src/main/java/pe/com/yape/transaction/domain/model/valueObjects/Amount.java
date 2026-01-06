package pe.com.yape.transaction.domain.model.valueObjects;

import pe.com.yape.transaction.domain.exceptions.InvalidAmountException;

import java.math.BigDecimal;

public class Amount {

    private final BigDecimal value;

    private Amount(BigDecimal value) {
        if (value == null) {
            throw new InvalidAmountException("Amount cannot be null");
        }
        if (value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Amount must be greater than zero");
        }
        this.value = value;
    }

    public static Amount of(BigDecimal value) {
        return new Amount(value);
    }

    public static Amount of(double value) {
        return new Amount(BigDecimal.valueOf(value));
    }


    public BigDecimal getValue() {
        return value;
    }
}
