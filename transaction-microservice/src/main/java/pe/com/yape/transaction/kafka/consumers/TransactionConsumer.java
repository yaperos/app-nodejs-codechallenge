package pe.com.yape.transaction.kafka.consumers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pe.com.yape.transaction.kafka.events.TransactionUpdatedEvent;
import pe.com.yape.transaction.services.TransactionService;

@Log4j2
@Component
@RequiredArgsConstructor
public class TransactionConsumer {

    private final TransactionService transactionService;
    private final ObjectMapper mapper = new ObjectMapper();

    @KafkaListener(
            topics = "${app.kafka.topics.transaction-updated}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws JsonProcessingException {
        log.info("Receiving a message in Transaction Consumer: " + message);
        TransactionUpdatedEvent event = mapper.readValue(message, TransactionUpdatedEvent.class);
        transactionService.updateStatus(
                event.getTransactionExternalId(),
                event.getStatus()
        );
    }
}