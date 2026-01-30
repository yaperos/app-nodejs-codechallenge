package pe.com.yape.transaction.kafka.producers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import pe.com.yape.transaction.kafka.events.TransactionCreatedEvent;
import pe.com.yape.transaction.models.entities.TransactionEntity;

@Log4j2
@Component
@RequiredArgsConstructor
public class TransactionProducer {

    @Value("${app.kafka.topics.transaction-created}")
    private String topic;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendTransactionCreated(TransactionEntity entity) throws JsonProcessingException {
            TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                    .transactionExternalId(entity.getTransactionExternalId())
                    .value(entity.getValue())
                    .build();
            String json = objectMapper.writeValueAsString(event);
            log.info("Sending a message from Transaction Producer " +  json);
            kafkaTemplate.send(topic, json);
    }

}