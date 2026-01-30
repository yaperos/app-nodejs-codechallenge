package pe.com.yape.antifraud.models;

import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.kafka.events.TransactionCreatedEvent;

import java.math.BigDecimal;

@Component
public class AmountLimitRule implements AntiFraudRule {

    private static final BigDecimal LIMIT = BigDecimal.valueOf(1000);

    @Override
    public boolean isFraud(TransactionCreatedEvent event) {
        return event.getValue().compareTo(LIMIT) > 0;
    }
}