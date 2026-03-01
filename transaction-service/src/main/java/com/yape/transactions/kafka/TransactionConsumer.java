package com.yape.transactions.kafka;

import com.yape.transactions.dto.kafka.TransactionValidated;
import com.yape.transactions.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final ITransactionService transactionService;

    @KafkaListener(
            topics = "${spring.kafka.topic.transaction-validated}",
            groupId = "${spring.kafka.consumer.group-id}",
            properties = {
                    "spring.json.value.default.type=com.yape.transactions.dto.kafka.TransactionValidated"
            }
    )
    public void consumeValidationResult(TransactionValidated response) {
        log.info("Received result of transaction {}: {}",
                response.id(), response.status());
        transactionService.updateStatus(response.id(), response.status());
    }
}
