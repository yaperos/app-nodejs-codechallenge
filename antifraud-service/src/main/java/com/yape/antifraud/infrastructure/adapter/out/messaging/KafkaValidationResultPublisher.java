package com.yape.antifraud.infrastructure.adapter.out.messaging;

import com.yape.antifraud.domain.model.ValidationResult;
import com.yape.antifraud.domain.port.out.ValidationResultPublisher;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

@ApplicationScoped
public class KafkaValidationResultPublisher implements ValidationResultPublisher {

    private static final Logger LOG = Logger.getLogger(KafkaValidationResultPublisher.class);

    @Inject
    @Channel("transaction-status-out")
    Emitter<Record<String, TransactionStatusEvent>> emitter;

    @Override
    public void publishValidationResult(ValidationResult result) {
        LOG.infof("Publishing validation result: %s -> %s",
                result.getTransactionExternalId(),
                result.getStatus());

        TransactionStatusEvent event = new TransactionStatusEvent(
                result.getTransactionExternalId(),
                result.getStatus().getName()
        );

        String key = result.getTransactionExternalId().toString();

        emitter.send(Record.of(key, event));

        LOG.infof("Validation result published successfully: %s", result.getTransactionExternalId());
    }
}
