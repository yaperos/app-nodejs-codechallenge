package com.yaperos.codechallenge.antifraud.application.service;

import com.yaperos.codechallenge.antifraud.domain.model.FraudCheckResult;
import com.yaperos.codechallenge.antifraud.domain.port.output.FraudResultPublisherPort;
import com.yaperos.codechallenge.shared.event.TransactionStatusType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AntiFraudServiceTest {

    @Mock
    private FraudResultPublisherPort fraudResultPublisher;

    @InjectMocks
    private AntiFraudService antiFraudService;

    @Test
    void validate_shouldApproveTransactionWithValueLessThanOrEqualTo1000() {
        UUID transactionId = UUID.randomUUID();

        antiFraudService.validate(transactionId, new BigDecimal("1000"));

        ArgumentCaptor<FraudCheckResult> captor = ArgumentCaptor.forClass(FraudCheckResult.class);
        verify(fraudResultPublisher).publishResult(captor.capture());
        assertEquals(TransactionStatusType.APPROVED, captor.getValue().getStatus());
        assertEquals(transactionId, captor.getValue().getTransactionExternalId());
    }

    @Test
    void validate_shouldRejectTransactionWithValueGreaterThan1000() {
        UUID transactionId = UUID.randomUUID();

        antiFraudService.validate(transactionId, new BigDecimal("1001"));

        ArgumentCaptor<FraudCheckResult> captor = ArgumentCaptor.forClass(FraudCheckResult.class);
        verify(fraudResultPublisher).publishResult(captor.capture());
        assertEquals(TransactionStatusType.REJECTED, captor.getValue().getStatus());
        assertEquals(transactionId, captor.getValue().getTransactionExternalId());
    }

    @Test
    void validate_shouldApproveTransactionWithSmallValue() {
        UUID transactionId = UUID.randomUUID();

        antiFraudService.validate(transactionId, new BigDecimal("120"));

        ArgumentCaptor<FraudCheckResult> captor = ArgumentCaptor.forClass(FraudCheckResult.class);
        verify(fraudResultPublisher).publishResult(captor.capture());
        assertEquals(TransactionStatusType.APPROVED, captor.getValue().getStatus());
    }

    @Test
    void validate_shouldRejectTransactionWithLargeValue() {
        UUID transactionId = UUID.randomUUID();

        antiFraudService.validate(transactionId, new BigDecimal("5000"));

        ArgumentCaptor<FraudCheckResult> captor = ArgumentCaptor.forClass(FraudCheckResult.class);
        verify(fraudResultPublisher).publishResult(captor.capture());
        assertEquals(TransactionStatusType.REJECTED, captor.getValue().getStatus());
    }

}
