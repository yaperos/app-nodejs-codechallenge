package com.yape.transaction.infrastructure.adapter.out.messaging;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

@ApplicationScoped
public class KafkaTransactionEventPublisher implements TransactionEventPublisher {

    private static final Logger LOG = Logger.getLogger(KafkaTransactionEventPublisher.class);

    @Inject
    @Channel("transaction-created-out")
    Emitter<Record<String, TransactionCreatedEvent>> emitter;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        LOG.infof("Publishing transaction created event: %s", transaction.getTransactionExternalId());

        TransactionCreatedEvent event = new TransactionCreatedEvent(
                transaction.getTransactionExternalId(),
                transaction.getAccountExternalIdDebit(),
                transaction.getAccountExternalIdCredit(),
                transaction.getTransferTypeId(),
                transaction.getValue(),
                transaction.getStatus().getName(),
                transaction.getCreatedAt()
        );

        String key = transaction.getTransactionExternalId().toString();
        
        emitter.send(Record.of(key, event));
        
        LOG.infof("Transaction created event published successfully: %s", transaction.getTransactionExternalId());
    }
}
