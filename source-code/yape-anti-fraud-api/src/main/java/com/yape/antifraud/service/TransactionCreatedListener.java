package com.yape.antifraud.service;

import com.yape.antifraud.domain.TransactionStatus;
import com.yape.antifraud.dto.TransactionCreatedEvent;
import com.yape.antifraud.dto.TransactionValidatedEvent;
import com.yape.antifraud.entity.TransactionEntity;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

import static com.yape.antifraud.util.Constant.ERROR_INVALID_PAYLOAD;
import static com.yape.antifraud.util.Constant.REASON_EXCEEDS_THRESHOLD;
import static com.yape.antifraud.util.Constant.MESSAGE_EVENT_ALREADY_PRECESSED;
import static com.yape.antifraud.util.Constant.REASON_UNDER_THRESHOLD;

@Log4j2
@Service
public class TransactionCreatedListener {

    private final TransactionPersistence transactionPersistence;
    private final TransactionValidatedEventPublisher transactionValidatedEventPublisher;
    private final BigDecimal threshold;

    public TransactionCreatedListener(
            TransactionPersistence transactionPersistence,
            TransactionValidatedEventPublisher transactionValidatedEventPublisher,
            @Value("${app.validation.threshold}") BigDecimal threshold
    ) {
        this.transactionPersistence = transactionPersistence;
        this.transactionValidatedEventPublisher = transactionValidatedEventPublisher;
        this.threshold = threshold;
    }

    @KafkaListener(
            topics = "${app.topics.transaction-created}",
            containerFactory = "transactionCreatedListenerFactory"
    )
    public void onMessage(ConsumerRecord<String, TransactionCreatedEvent> transactionCreatedRecord,
                          Acknowledgment ack) throws Exception {
        TransactionCreatedEvent transactionCreatedEvent = transactionCreatedRecord.value();
        if (transactionCreatedEvent == null || transactionCreatedEvent.transactionExternalId() == null
                || transactionCreatedEvent.value() == null) {
            throw new IllegalArgumentException(ERROR_INVALID_PAYLOAD);
        }
        log.info("Trying publish event with key: {}", transactionCreatedEvent.transactionExternalId());

        TransactionEntity existingTransaction = transactionPersistence
                .findByTransactionExternalId(transactionCreatedEvent.transactionExternalId());

        if (existingTransaction != null &&
                !existingTransaction.getTransactionStatus().name().equals(TransactionStatus.PENDING.name())) {
            log.info(MESSAGE_EVENT_ALREADY_PRECESSED, transactionCreatedEvent.transactionExternalId());
            ack.acknowledge();
            return;
        }

        boolean approved = transactionCreatedEvent.value().compareTo(threshold) <= 0;
        String status = approved ? TransactionStatus.APPROVED.name() : TransactionStatus.REJECTED.name();
        String reason = approved ? REASON_UNDER_THRESHOLD : REASON_EXCEEDS_THRESHOLD;

        TransactionValidatedEvent transactionValidatedEvent = new TransactionValidatedEvent(
                transactionCreatedEvent.transactionExternalId(),
                status,
                reason,
                Instant.now()
        );

        transactionValidatedEventPublisher.createTransactionValidatedEvent(transactionValidatedEvent);
        ack.acknowledge();
    }
}
