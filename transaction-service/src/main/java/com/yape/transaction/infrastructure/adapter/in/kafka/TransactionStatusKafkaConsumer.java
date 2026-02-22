package com.yape.transaction.infrastructure.adapter.in.kafka;

import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusCommand;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.yape.transaction.infrastructure.config.KafkaGroups;
import com.yape.transaction.infrastructure.config.KafkaTopics;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class TransactionStatusKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionStatusKafkaConsumer.class);
    private static final String CORRELATION_HEADER = "X-Correlation-ID";

    private final UpdateTransactionStatusUseCase updateStatusUseCase;

    public TransactionStatusKafkaConsumer(UpdateTransactionStatusUseCase updateStatusUseCase) {
        this.updateStatusUseCase = updateStatusUseCase;
    }

    @KafkaListener(
            topics = KafkaTopics.TRANSACTION_STATUS_UPDATED,
            groupId = KafkaGroups.TRANSACTION_STATUS_UPDATED
    )
    public void consume(ConsumerRecord<String, TransactionStatusMessage> record) {
        try {
            String correlationId = extractCorrelationId(record);
            MDC.put("correlationId", correlationId);
            MDC.put("service", "transaction-service");

            TransactionStatusMessage message = record.value();
            log.info("event=kafka.message_received, topic={}, transactionId={}, status={}",
                    record.topic(), message.transactionId(), message.status());
            try {
                var command = new UpdateTransactionStatusCommand(
                        message.transactionId(),
                        TransactionStatus.fromString(message.status())
                );
                updateStatusUseCase.execute(command);
            } catch (Exception ex) {
                log.error("event=kafka.message_processing_failed, topic={}, transactionId={}, outcome=failure, error={}",
                        record.topic(), message.transactionId(), ex.getMessage(), ex);
                throw ex;
            }
        } finally {
            MDC.clear();
        }
    }

    private String extractCorrelationId(ConsumerRecord<String, TransactionStatusMessage> record) {
        Header header = record.headers().lastHeader(CORRELATION_HEADER);
        if (header != null && header.value() != null) {
            return new String(header.value(), StandardCharsets.UTF_8);
        }
        return UUID.randomUUID().toString();
    }
}
