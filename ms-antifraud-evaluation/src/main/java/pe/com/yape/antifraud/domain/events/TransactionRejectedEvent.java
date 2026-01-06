package pe.com.yape.antifraud.domain.events;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class TransactionRejectedEvent {

    private final UUID transactionExternalId;
    private final LocalDateTime rejectedAt;

    public TransactionRejectedEvent(UUID transactionExternalId){
        this.transactionExternalId = transactionExternalId;
        this.rejectedAt = LocalDateTime.now();
    }
}
