package pe.com.yape.antifraud.kafka.producers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.kafka.events.TransactionUpdatedEvent;

import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class AntiFraudProducer {

    @Value("${app.kafka.topics.transaction-updated}")
    private String topic;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendTransactionUpdated(UUID transactionExternalId, String status) throws JsonProcessingException {
        TransactionUpdatedEvent event = TransactionUpdatedEvent.builder()
                .transactionExternalId(transactionExternalId)
                .status(status)
                .build();
        String payload = objectMapper.writeValueAsString(event);
        log.info("Sending a message from AntiFraud Producer: " + payload);
        kafkaTemplate.send(topic, payload);
    }
}