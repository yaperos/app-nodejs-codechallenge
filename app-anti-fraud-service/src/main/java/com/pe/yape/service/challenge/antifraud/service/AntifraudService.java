package com.pe.yape.service.challenge.antifraud.service;

import com.pe.yape.service.challenge.transactions.avro.TransactionCreatedEvent;
import com.pe.yape.service.challenge.antifraud.config.properties.AntifraudProperties;
import com.pe.yape.service.challenge.antifraud.domain.TransactionStatus;
import com.pe.yape.service.challenge.antifraud.domain.ValidationResult;
import com.pe.yape.service.challenge.antifraud.util.ReasonCodes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AntifraudService {

    private final AntifraudProperties antifraudProperties;

    public Mono<ValidationResult> validate(TransactionCreatedEvent event) {
        return Mono.fromCallable(() -> {

            ValidationResult.ValidationResultBuilder validationResultBuilder = ValidationResult.builder();

            if (Double.compare(event.getValue(), 0.0) == 0) {
                return validationResultBuilder.transactionStatus(TransactionStatus.REJECTED)
                        .reasonCode(ReasonCodes.MISSING_VALUE)
                        .build();
            }
            if (event.getValue() > Integer.parseInt(antifraudProperties.getAmountLimit())) {
                return validationResultBuilder.transactionStatus(TransactionStatus.REJECTED)
                        .reasonCode(ReasonCodes.VALUE_EXCEEDS_LIMIT)
                        .build();
            }
            return validationResultBuilder.transactionStatus(TransactionStatus.APPROVED)
                    .build();
        });

    }


}
