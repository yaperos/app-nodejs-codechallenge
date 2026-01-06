package pe.com.yape.transaction.infraestructure.adapter.in.messaging.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import pe.com.yape.transaction.infraestructure.adapter.in.messaging.kafka.dto.TransactionEvaluatedEventDto;

@Component
public class KafkaTransactionConsumer {
    private static final Logger logger = LoggerFactory.getLogger(KafkaTransactionConsumer.class);

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    public KafkaTransactionConsumer(UpdateTransactionStatusUseCase updateTransactionStatusUseCase){
        this.updateTransactionStatusUseCase = updateTransactionStatusUseCase;

    }

    @KafkaListener(
            topics = "transaction.rejected",
            groupId = "transaction-rejected-group-id"
    )
    private void consumeRejectedEvent(TransactionEvaluatedEventDto eventDto){

        logger.info("event recieved with id: {}", eventDto.getTransactionExternalId());

        TransactionId transactionId = TransactionId.of(String.valueOf(eventDto.getTransactionExternalId()));
        updateTransactionStatusUseCase.reject(transactionId);
    }

    @KafkaListener(
            topics = "transaction.approved",
            groupId = "transaction-approved-group-id"
    )
    private void consumeApprovedEvent(TransactionEvaluatedEventDto eventDto){

        logger.info("event recieved with id: {}", eventDto.getTransactionExternalId());

        TransactionId transactionId = TransactionId.of(String.valueOf(eventDto.getTransactionExternalId()));
        updateTransactionStatusUseCase.approve(transactionId);
    }
}
