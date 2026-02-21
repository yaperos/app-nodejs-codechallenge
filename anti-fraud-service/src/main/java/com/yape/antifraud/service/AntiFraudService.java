package com.yape.antifraud.service;

import com.yape.antifraud.constant.TransactStatus;
import com.yape.antifraud.domain.TransactionStatus;
import com.yape.antifraud.domain.TransactionType;
import com.yape.antifraud.event.FraudResultEvent;
import com.yape.antifraud.event.TransactionEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Instant;

@Service
@Slf4j
public class AntiFraudService {

    public Mono<FraudResultEvent> evaluate(TransactionEvent event) {
        return Mono.fromCallable(() -> runRules(event))
                .subscribeOn(Schedulers.boundedElastic());
    }

    private FraudResultEvent runRules(TransactionEvent event) {
        String status;

        if (event.getValue() >= 1000) {
            status = TransactStatus.REJECTED.name();
        } else {
            status = TransactStatus.APPROVED.name();
        }

        return FraudResultEvent.builder()
                .transactionId(event.getTransactionId())
                .transactionExternalId(event.getTransactionId())
                .transactionType(new TransactionType(event.getTransferTypeId().toString()))
                .transactionStatus(new TransactionStatus(status))
                .value(event.getValue())
                .createdAt(Instant.now())
                .build();
    }

}
