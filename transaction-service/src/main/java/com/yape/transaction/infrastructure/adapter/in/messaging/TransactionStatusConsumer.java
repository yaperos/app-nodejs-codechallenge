package com.yape.transaction.infrastructure.adapter.in.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.yape.transaction.infrastructure.adapter.out.cache.IdempotencyService;
import io.smallrye.common.annotation.Blocking;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

@ApplicationScoped
public class TransactionStatusConsumer {

    private static final Logger LOG = Logger.getLogger(TransactionStatusConsumer.class);

    private final UpdateTransactionStatusUseCase updateStatusUseCase;
    private final IdempotencyService idempotencyService;
    private ObjectMapper objectMapper;

    @Inject
    public TransactionStatusConsumer(UpdateTransactionStatusUseCase updateStatusUseCase,
                                     IdempotencyService idempotencyService) {
        this.updateStatusUseCase = updateStatusUseCase;
        this.idempotencyService = idempotencyService;
    }

    @PostConstruct
    void init() {
        this.objectMapper = new ObjectMapper();
    }

    @Incoming("transaction-status-in")
    @Blocking
    public void consume(String message) {
        LOG.infof("Received raw status message: %s", message);

        try {
            TransactionStatusEvent event = objectMapper.readValue(message, TransactionStatusEvent.class);

            LOG.infof("Parsed transaction status event: %s -> %s",
                event.getTransactionExternalId(), event.getStatus());

            String idempotencyKey = "status:" + event.getTransactionExternalId() + ":" + event.getStatus();
            if (idempotencyService.isProcessed(idempotencyKey)) {
                LOG.warnf("Duplicate event detected, skipping: %s", idempotencyKey);
                return;
            }

            TransactionStatus status = TransactionStatus.fromString(event.getStatus());
            updateStatusUseCase.updateStatus(event.getTransactionExternalId(), status);

            idempotencyService.markAsProcessed(idempotencyKey);

            LOG.infof("Transaction status updated successfully: %s -> %s",
                event.getTransactionExternalId(), status);

        } catch (Exception e) {
            LOG.errorf(e, "Error processing status message: %s", message);
        }
    }
}
