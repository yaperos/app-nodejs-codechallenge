package pe.com.yape.antifraud.infraestructure.adapters.out.messaging.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.domain.model.TransactionStatus;
import pe.com.yape.antifraud.domain.ports.out.PublishTransactionResultPort;
import pe.com.yape.antifraud.infraestructure.adapters.out.messaging.kafka.dto.TransactionEvaluatedEventDto;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class TransactionResultProducer implements PublishTransactionResultPort {
    private final Logger logger = LoggerFactory.getLogger(TransactionResultProducer.class);

    private final KafkaTemplate<String, TransactionEvaluatedEventDto> kafkaTemplate;


    private static final Map<TransactionStatus, String> TOPIC_BY_STATUS =
            Map.of(
                    TransactionStatus.APPROVED, KafkaTopicsProperties.TRANSACTION_APPROVED,
                    TransactionStatus.REJECTED, KafkaTopicsProperties.TRANSACTION_REJECTED
            );

    public TransactionResultProducer(KafkaTemplate<String, TransactionEvaluatedEventDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;

    }

    @Override
    public void publishResult(UUID transactionExternalId, TransactionStatus transactionStatus) {

        TransactionEvaluatedEventDto eventDto = new TransactionEvaluatedEventDto(
                transactionExternalId,
                transactionStatus.getName()
        );
        try {

            String key = eventDto.getTransactionExternalId().toString();

            String topic = TOPIC_BY_STATUS.get(transactionStatus);

            if(topic == null){
                throw new IllegalStateException("Unsupported status: " + transactionStatus);
            }

            CompletableFuture<SendResult<String, TransactionEvaluatedEventDto>> future =
                    kafkaTemplate.send(topic, key, eventDto);

            future.whenComplete((result, ex) -> {
                if (ex == null) {

                    logger.info("Transaction created event published successfully. " +
                                    "Topic: {}, Partition: {}, Offset: {}",
                            result.getRecordMetadata().topic(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {

                    logger.error("Failed to publish transaction created event for ID: {}",
                            eventDto.getTransactionExternalId(), ex);

                }
            });

        } catch (Exception e) {
            logger.error("Unexpected error publishing transaction created event for ID: {}",
                   eventDto.getTransactionExternalId() , e);
            throw new RuntimeException("Failed to publish transaction created event", e);
        }


    }
}
