package com.tec.yape.antifraud.application.usecase;

import com.tec.yape.antifraud.domain.enums.TransactionStatus;
import com.tec.yape.antifraud.domain.model.TransactionCreatedEvent;
import com.tec.yape.antifraud.domain.model.TransactionValidatedEvent;
import com.tec.yape.antifraud.domain.port.input.FraudValidationInPort;
import com.tec.yape.antifraud.domain.port.output.TransactionStatusPublisherOutPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class FraudValidationUseCase implements FraudValidationInPort {

    private final TransactionStatusPublisherOutPort statusPublisher;

    @Override
    public void validate(TransactionCreatedEvent event) {


        TransactionStatus status =
                event.value().compareTo(BigDecimal.valueOf(1000)) > 0
                        ? TransactionStatus.RECHAZADO
                        : TransactionStatus.APROBADO;

        statusPublisher.publish(
                new TransactionValidatedEvent(
                        event.transactionExternalId(),
                        status
                )
        );
    }
}