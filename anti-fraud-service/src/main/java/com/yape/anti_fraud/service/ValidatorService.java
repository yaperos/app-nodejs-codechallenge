package com.yape.anti_fraud.service;

import com.yape.anti_fraud.dto.kafka.TransactionCreated;
import com.yape.anti_fraud.dto.kafka.TransactionValidated;
import com.yape.anti_fraud.kafka.TransactionProducer;
import com.yape.anti_fraud.model.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidatorService {
    private final TransactionProducer transactionProducer;

    public void validate(TransactionCreated event) {
        TransactionStatus status = TransactionStatus.APPROVED;
        if (event.value() > 1000.0) {
            status = TransactionStatus.REJECTED;
        }
        transactionProducer.sendStatus(new TransactionValidated(event.id(), status));
    }
}
