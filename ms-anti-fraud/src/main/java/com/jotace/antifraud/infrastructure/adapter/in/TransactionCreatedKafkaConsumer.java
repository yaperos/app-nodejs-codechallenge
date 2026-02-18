package com.jotace.antifraud.infrastructure.adapter.in;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotace.antifraud.application.port.in.ValidateTransactionUseCase;
import com.jotace.antifraud.domain.command.TransactionValidationCommand;
import com.jotace.antifraud.domain.model.Transaction;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionCreatedKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionCreatedKafkaConsumer.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final ValidateTransactionUseCase validateTransactionUseCase;

    public TransactionCreatedKafkaConsumer(ValidateTransactionUseCase validateTransactionUseCase) {
        this.validateTransactionUseCase = validateTransactionUseCase;
    }

    @KafkaListener(topics = "transaction-created", groupId = "anti-fraud-group")
    public void listen(Transaction transaction) {
        log.info("Received transaction: {}", transaction);

        TransactionValidationCommand command = new TransactionValidationCommand(
                transaction.transactionExternalId(),
                transaction.value()
        );

        validateTransactionUseCase.execute(command);
    }


}
