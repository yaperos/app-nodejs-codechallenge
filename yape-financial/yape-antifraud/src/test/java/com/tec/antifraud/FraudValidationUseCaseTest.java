package com.tec.antifraud;

import com.tec.yape.antifraud.application.usecase.FraudValidationUseCase;
import com.tec.yape.antifraud.domain.enums.TransactionStatus;
import com.tec.yape.antifraud.domain.model.TransactionCreatedEvent;
import com.tec.yape.antifraud.domain.port.output.TransactionStatusPublisherOutPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FraudValidationUseCaseTest {

    @Mock
    private TransactionStatusPublisherOutPort publisher;

    @InjectMocks
    private FraudValidationUseCase useCase;

    @Test
    void shouldApproveTransactionWhenValueIsLessOrEqualThan1000() {
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                UUID.randomUUID(),
                new BigDecimal("1000")
        );

        useCase.validate(event);

        verify(publisher).publish(argThat(e -> e.status().equals(TransactionStatus.APROBADO)));
    }

    @Test
    void shouldRejectTransactionWhenValueIsGreaterThan1000() {
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                UUID.randomUUID(),
                new BigDecimal("1500")
        );

        useCase.validate(event);

        verify(publisher).publish(argThat(e -> e.status().equals(TransactionStatus.RECHAZADO)));
    }
}
