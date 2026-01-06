package pe.com.yape.transaction.infraestructure.adapter.out.messaging.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import pe.com.yape.transaction.domain.events.TransactionCreatedEvent;
import pe.com.yape.transaction.domain.port.out.EventPublisherPort;
import pe.com.yape.transaction.infraestructure.adapter.out.messaging.kafka.dto.TransactionEventDto;

import java.util.concurrent.CompletableFuture;

@Component
public class KafkaEventPublisher implements EventPublisherPort {

    private static final Logger logger = LoggerFactory.getLogger(KafkaEventPublisher.class);

    @Value("${kafka.topics.transaction-created}")
    private String transactionCreatedTopic;

    private final KafkaTemplate<String, TransactionEventDto> kafkaTemplate;

    public KafkaEventPublisher(KafkaTemplate<String, TransactionEventDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }


    @Override
    public void publishTransactionCreated(TransactionCreatedEvent event) {
        logger.info("Publishing transaction created event for ID: {}",
                event.getTransactionExternalId());

        try {

            TransactionEventDto dto = new TransactionEventDto(
                    event.getTransactionExternalId(),
                    event.getAmount()
            );


            String key = event.getTransactionExternalId().toString();


            CompletableFuture<SendResult<String, TransactionEventDto>> future =
                    kafkaTemplate.send(transactionCreatedTopic, key, dto);

            future.whenComplete((result, ex) -> {
                if (ex == null) {

                    logger.info("Transaction created event published successfully. " +
                                    "Topic: {}, Partition: {}, Offset: {}",
                            result.getRecordMetadata().topic(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    logger.error("Failed to publish transaction created event for ID: {}",
                            event.getTransactionExternalId(), ex);

                }
            });

        } catch (Exception e) {
            logger.error("Unexpected error publishing transaction created event for ID: {}",
                    event.getTransactionExternalId(), e);
            throw new RuntimeException("Failed to publish transaction created event", e);
        }
    }
}
