package com.yape.challenge.domain.service;

import com.pe.yape.service.challenge.kafka.avro.CreatedTransactionMessageEvent;
import com.yape.challenge.domain.model.Status;
import com.yape.challenge.domain.model.ValidateTransactionEvent;
import com.yape.challenge.domain.port.in.AntiFraudUseCase;
import com.yape.challenge.domain.port.out.AntiFraudProducerPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class AntiFraudService implements AntiFraudUseCase {

    private final AntiFraudProducerPort producerPort;

    @Override
    public Mono<Void> validate(CreatedTransactionMessageEvent transaction) {
        log.info("Validating transaction with id: {}", transaction.getTransactionId());
        ValidateTransactionEvent validateTransactionEvent = new ValidateTransactionEvent();
        validateTransactionEvent.setTransactionId(transaction.getTransactionId().toString());
        if (transaction.getValue() <= 1000) {
            validateTransactionEvent.setStatus(Status.APPROVED.getDescription());
        } else {
            validateTransactionEvent.setStatus(Status.REJECTED.getDescription());
        }

        return this.producerPort.sendValidationResult(validateTransactionEvent);
    }
}
