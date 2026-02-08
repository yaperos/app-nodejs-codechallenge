package com.yaperos.codechallenge.antifraud.infrastructure.adapter.output.kafka;

import com.yaperos.codechallenge.antifraud.domain.model.FraudCheckResult;
import com.yaperos.codechallenge.antifraud.domain.port.output.FraudResultPublisherPort;
import com.yaperos.codechallenge.shared.config.KafkaTopicConfig;
import com.yaperos.codechallenge.shared.event.TransactionStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FraudResultKafkaPublisher implements FraudResultPublisherPort {

    private final KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;

    @Override
    public void publishResult(FraudCheckResult result) {
        var event = new TransactionStatusEvent(
                result.getTransactionExternalId(),
                result.getStatus()
        );
        log.info("Publishing transaction-status event: transactionId={}, status={}",
                result.getTransactionExternalId(), result.getStatus());
        kafkaTemplate.send(KafkaTopicConfig.TRANSACTION_STATUS_TOPIC,
                result.getTransactionExternalId().toString(),
                event);
    }

}
