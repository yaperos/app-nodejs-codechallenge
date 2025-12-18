package com.yape.transactions.service;

import com.yape.transactions.domain.TransactionStatus;
import com.yape.transactions.dto.TransactionValidatedEvent;
import com.yape.transactions.entity.TransactionEntity;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import static com.yape.transactions.util.Constant.ERROR_INVALID_PAYLOAD;
import static com.yape.transactions.util.Constant.MESSAGE_EVENT_ALREADY_PRECESSED;
import static com.yape.transactions.util.Constant.MESSAGE_NOT_EXIST_TRANSACTION;

@Log4j2
@Service
public class TransactionValidatedListener {

    private final TransactionPersistence transactionPersistence;

    public TransactionValidatedListener(
            TransactionPersistence transactionPersistence
    ) {
        this.transactionPersistence = transactionPersistence;
    }

    @KafkaListener(
            topics = "${app.topics.transaction-validated}",
            containerFactory = "transactionValidatedListenerFactory"
    )
    public void onMessage(ConsumerRecord<String, TransactionValidatedEvent> transactionValidatedRecord,
                          Acknowledgment ack) throws Exception {
        TransactionValidatedEvent transactionValidatedEvent = transactionValidatedRecord.value();
        if (transactionValidatedEvent == null || transactionValidatedEvent.transactionExternalId() == null
                || transactionValidatedEvent.status() == null) {
            throw new IllegalArgumentException(ERROR_INVALID_PAYLOAD);
        }
        log.info("Trying update transaction with key: {}", transactionValidatedEvent.transactionExternalId());

        TransactionEntity existingTransaction = transactionPersistence
                .findByTransactionExternalId(transactionValidatedEvent.transactionExternalId());

        if (existingTransaction == null) {
            log.info(MESSAGE_NOT_EXIST_TRANSACTION, transactionValidatedEvent.transactionExternalId());
            ack.acknowledge();
            return;
        }
        if (existingTransaction != null &&
                !existingTransaction.getTransactionStatus().name().equals(TransactionStatus.PENDING.name())) {
            log.info(MESSAGE_EVENT_ALREADY_PRECESSED, transactionValidatedEvent.transactionExternalId());
            ack.acknowledge();
            return;
        }

        transactionPersistence.updateTransactionStatus(existingTransaction,transactionValidatedEvent.status());
        ack.acknowledge();
    }
}
