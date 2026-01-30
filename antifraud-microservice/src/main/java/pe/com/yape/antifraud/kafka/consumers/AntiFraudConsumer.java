package pe.com.yape.antifraud.kafka.consumers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.kafka.events.TransactionCreatedEvent;
import pe.com.yape.antifraud.kafka.producers.AntiFraudProducer;
import pe.com.yape.antifraud.models.AntiFraudDecision;
import pe.com.yape.antifraud.models.TransactionStatus;
import pe.com.yape.antifraud.services.AntiFraudService;

@Log4j2
@Component
@RequiredArgsConstructor
public class AntiFraudConsumer {

    private final AntiFraudService antifraudService;
    private final AntiFraudProducer producer;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "${app.kafka.topics.transaction-created}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws JsonProcessingException {
        log.info("Receiving a message in AntiFraud Consumer: " + message);
        TransactionCreatedEvent event = objectMapper.readValue(message, TransactionCreatedEvent.class);
        AntiFraudDecision decision = antifraudService.evaluate(event);
        producer.sendTransactionUpdated(
                event.getTransactionExternalId(),
                decision.isApproved()
                        ? TransactionStatus.APPROVED.name()
                        : TransactionStatus.REJECTED.name()
        );
    }
}
