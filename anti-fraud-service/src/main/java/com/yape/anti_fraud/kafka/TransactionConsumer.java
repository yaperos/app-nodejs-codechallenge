package com.yape.anti_fraud.kafka;

import com.yape.anti_fraud.dto.kafka.TransactionCreated;
import com.yape.anti_fraud.service.ValidatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final ValidatorService validatorService;

    @KafkaListener(
            topics = "${spring.kafka.topic.transaction-created}",
            groupId = "${spring.kafka.consumer.group-id}",
            properties = {
                    "spring.json.value.default.type=com.yape.anti_fraud.dto.kafka.TransactionCreated"
            }
    )
    public void consumeTransaction(TransactionCreated response) {
        log.info("Received transaction {} for validation", response.id());
        validatorService.validate(response);
    }
}
