package com.yape.antifraud.consumer;

import com.yape.antifraud.producer.AntiFraudProducer;
import com.yape.antifraud.service.AntiFraudService;
import com.yape.shared.TransactionCreatedEvent;
import com.yape.shared.TransactionValidatedEvent;
import com.yape.transaction_service.entity.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests del AntiFraudConsumer")
class AntiFraudConsumerTest {

    @Mock
    private AntiFraudService service;

    @Mock
    private AntiFraudProducer producer;

    @Captor
    private ArgumentCaptor<TransactionValidatedEvent> eventCaptor;

    private AntiFraudConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer = new AntiFraudConsumer(service, producer);
    }

    @Test
    @DisplayName("Debe procesar transacción aprobada correctamente")
    void shouldProcessApprovedTransaction() {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(transactionId, new BigDecimal("500.00"));

        when(service.validate(any(BigDecimal.class))).thenReturn(TransactionStatus.valueOf("APPROVED"));

        consumer.validate(event);

        verify(service).validate(new BigDecimal("500.00"));
        verify(producer).sendValidationResult(eventCaptor.capture());

        TransactionValidatedEvent result = eventCaptor.getValue();
        assertEquals(transactionId, result.transactionExternalId());
        assertEquals("APPROVED", result.status());
    }

    @Test
    @DisplayName("Debe procesar transacción rechazada correctamente")
    void shouldProcessRejectedTransaction() {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(transactionId, new BigDecimal("1500.00"));

        when(service.validate(any(BigDecimal.class))).thenReturn(TransactionStatus.valueOf("REJECTED"));

        consumer.validate(event);

        verify(service).validate(new BigDecimal("1500.00"));
        verify(producer).sendValidationResult(eventCaptor.capture());

        TransactionValidatedEvent result = eventCaptor.getValue();
        assertEquals(transactionId, result.transactionExternalId());
        assertEquals("REJECTED", result.status());
    }

    @Test
    @DisplayName("Debe manejar errores del servicio")
    void shouldHandleServiceErrors() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(transactionId, new BigDecimal("500.00"));

        when(service.validate(any(BigDecimal.class)))
                .thenThrow(new RuntimeException("Error de prueba"));

        assertDoesNotThrow(() -> consumer.validate(event));

        verify(producer, never()).sendValidationResult(any());

        verify(service).validate(any(BigDecimal.class));
    }
}