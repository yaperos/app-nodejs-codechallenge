package pe.com.yape.antifraud.infraestructure.adapters.in.messaging.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.domain.model.TransactionEvaluation;
import pe.com.yape.antifraud.domain.ports.in.EvaluateTransactionUseCase;
import pe.com.yape.antifraud.infraestructure.adapters.in.messaging.kafka.dto.TransactionEventDto;


@Component
public class TransactionCreatedConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TransactionCreatedConsumer.class);

    private final EvaluateTransactionUseCase evaluateTransactionUseCase;

    public TransactionCreatedConsumer(EvaluateTransactionUseCase evaluateTransactionUseCase){
        this.evaluateTransactionUseCase = evaluateTransactionUseCase;
    }

    @KafkaListener(
            topics = "transaction.created",
            groupId = "anti-fraud-group"
    )
    public void consume(TransactionEventDto eventDto){

        logger.info("event recieved with id: {}", eventDto.getTransactionExternalId());

        TransactionEvaluation transactionEvaluation = new TransactionEvaluation(
                eventDto.getTransactionExternalId(),
                eventDto.getAmount()
        );

        evaluateTransactionUseCase.evaluate(transactionEvaluation);
    }

}
