package org.beh.antifraudservice.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.antifraudservice.dto.FraudDecision;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "transaction.status.updated";

    public void publishDecision(FraudDecision decision) {
        try {
            String payload = objectMapper.writeValueAsString(decision);

            // Key = transactionId → same transaction events always go to same partition
            // This is essential for ordering guarantees
            kafkaTemplate.send(TOPIC, decision.getTransactionId(), payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish fraud decision for transaction [{}]: {}",
                                decision.getTransactionId(), ex.getMessage());
                            throw new RuntimeException(ex);
                        }
                        log.debug("Fraud decision published for transaction [{}] status [{}]",
                            decision.getTransactionId(), decision.getStatus());
                    });

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize fraud decision", e);
        }
    }
}
