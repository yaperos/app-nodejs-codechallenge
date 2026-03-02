package com.yape.antifraud.infrastructure.adapter.in.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yape.antifraud.domain.model.TransactionToValidate;
import com.yape.antifraud.domain.model.ValidationResult;
import com.yape.antifraud.domain.port.in.ValidateTransactionUseCase;
import com.yape.antifraud.domain.port.out.ValidationResultPublisher;
import com.yape.antifraud.infrastructure.adapter.out.cache.IdempotencyService;
import io.smallrye.common.annotation.Blocking;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

@ApplicationScoped
public class TransactionCreatedConsumer {

    private static final Logger LOG = Logger.getLogger(TransactionCreatedConsumer.class);

    private final ValidateTransactionUseCase validateUseCase;
    private final ValidationResultPublisher resultPublisher;
    private final IdempotencyService idempotencyService;
    private ObjectMapper objectMapper;

    @Inject
    public TransactionCreatedConsumer(ValidateTransactionUseCase validateUseCase,
                                      ValidationResultPublisher resultPublisher,
                                      IdempotencyService idempotencyService) {
        this.validateUseCase = validateUseCase;
        this.resultPublisher = resultPublisher;
        this.idempotencyService = idempotencyService;
    }

    @PostConstruct
    void init() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Incoming("transaction-created-in")
    @Blocking
    public void consume(String message) {
        LOG.infof("Received raw message: %s", message);

        try {
            TransactionCreatedEvent event = objectMapper.readValue(message, TransactionCreatedEvent.class);

            LOG.infof("Parsed transaction created event: %s", event.getTransactionExternalId());

            String idempotencyKey = "validate:" + event.getTransactionExternalId();
            if (!idempotencyService.tryAcquireLock(idempotencyKey)) {
                LOG.warnf("Duplicate event detected, skipping: %s", event.getTransactionExternalId());
                return;
            }

            TransactionToValidate transaction = new TransactionToValidate(
                event.getTransactionExternalId(),
                event.getValue()
            );

            ValidationResult result = validateUseCase.validate(transaction);

            resultPublisher.publishValidationResult(result);

            LOG.infof("Transaction %s validated: %s",
                event.getTransactionExternalId(),
                result.getStatus());

        } catch (Exception e) {
            LOG.errorf(e, "Error processing message: %s", message);
        }
    }
}
