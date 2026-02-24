package org.beh.antifraudservice.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.antifraudservice.dto.FraudDecision;
import org.beh.antifraudservice.dto.TransactionEvent;
import org.beh.antifraudservice.producer.TransactionStatusProducer;
import org.beh.antifraudservice.service.FraudDetectionService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionCreatedConsumer {

    private final FraudDetectionService fraudDetectionService;
    private final TransactionStatusProducer statusProducer;
    private final ObjectMapper objectMapper;

    @KafkaListener(
        topics = "transaction.created",
        groupId = "anti-fraud-service-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment ack) {

        log.debug("Received transaction.created event from partition [{}] offset [{}]", partition, offset);

        try {
            TransactionEvent event = objectMapper.readValue(message, TransactionEvent.class);

            log.info("Processing transaction [{}] value [{}] for fraud evaluation",
                event.getTransactionId(), event.getValue());

            FraudDecision decision = fraudDetectionService.evaluate(event);
            statusProducer.publishDecision(decision);

            // Only ack after successfully publishing the decision back
            ack.acknowledge();

        } catch (Exception e) {
            // No ack -> Kafka redelivers.
            // After max retries, DeadLetterPublishingRecoverer routes to transaction.created.DLT
            log.error("Failed to process transaction.created event at partition [{}] offset [{}]: {}",
                partition, offset, e.getMessage(), e);
        }
    }
}
