package pe.com.yape.antifraud.domain.events;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class TransactionApprovedEvent {

    private final UUID transactionExternalId;
    private final LocalDateTime approvedAt;

    public TransactionApprovedEvent(UUID transactionExternalId){
        this.transactionExternalId = transactionExternalId;
        this.approvedAt = LocalDateTime.now();
    }
}
