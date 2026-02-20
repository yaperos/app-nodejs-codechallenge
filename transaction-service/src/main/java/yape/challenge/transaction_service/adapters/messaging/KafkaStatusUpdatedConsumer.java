package yape.challenge.transaction_service.adapters.messaging;

import lombok.extern.slf4j.Slf4j;
import yape.challenge.common.events.TransactionStatusUpdatedEvent;
import yape.challenge.transaction_service.adapters.messaging.event.StatusUpdatedEvent;
import yape.challenge.transaction_service.adapters.persistence.TransactionJpaRepository;
import yape.challenge.transaction_service.domain.TransactionStatus;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KafkaStatusUpdatedConsumer {

    private final TransactionJpaRepository repo;

    public KafkaStatusUpdatedConsumer(TransactionJpaRepository repo) {
        this.repo = repo;
    }

    @KafkaListener(topics = "transactions.status-updated", groupId = "transaction-service")
    public void onStatusUpdated(TransactionStatusUpdatedEvent event) {
        log.info("[STATUS_CONSUME] txId={} status={}", event.transactionExternalId, event.status);
        log.info("[DB_UPDATE] txId={} newStatus={}", event.transactionExternalId, event.status);

        repo.findByTransactionExternalId(event.transactionExternalId).ifPresent(tx -> {
            // event.status viene "approved"/"rejected" en minúsculas
            TransactionStatus newStatus = TransactionStatus.valueOf(event.status.toUpperCase());
            tx.setStatus(newStatus);
            repo.save(tx);
        });
    }
}