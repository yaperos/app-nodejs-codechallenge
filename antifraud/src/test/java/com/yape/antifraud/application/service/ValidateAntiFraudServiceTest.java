package com.yape.antifraud.application.service;

import com.yape.antifraud.domain.enums.TransactionStatus;
import com.yape.antifraud.domain.model.EventInbound;
import com.yape.antifraud.domain.model.EventOutbound;
import com.yape.antifraud.domain.ports.KafkaProducerPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ValidateAntiFraudServiceTest {

    @Mock
    private KafkaProducerPort kafkaProducerPort;

    @InjectMocks
    private ValidateAntiFraudService validateAntiFraudService;

    private EventInbound buildEventInbound(Long id, String transactionExternalId, BigDecimal value) {
        EventInbound event = new EventInbound();
        event.setId(id);
        event.setTransactionExternalId(transactionExternalId);
        event.setValue(value);
        return event;
    }

    @Test
    @DisplayName("Given a value equal to the threshold (1000), the transaction should be APPROVED")
    void execute_whenValueEqualsThreshold_shouldApprove() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(1L, "ext-001", new BigDecimal("1000"));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort, times(1)).sendTransactionProcessed(captor.capture());

        EventOutbound outbound = captor.getValue();
        assertThat(outbound.getStatus()).isEqualTo(TransactionStatus.APPROVED.getValue());
        assertThat(outbound.getId()).isEqualTo(1L);
        assertThat(outbound.getTransactionExternalId()).isEqualTo("ext-001");
        assertThat(outbound.getValue()).isEqualByComparingTo(new BigDecimal("1000"));
    }

    @Test
    @DisplayName("Given a value below the threshold (999.99), the transaction should be APPROVED")
    void execute_whenValueBelowThreshold_shouldApprove() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(2L, "ext-002", new BigDecimal("999.99"));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort).sendTransactionProcessed(captor.capture());

        assertThat(captor.getValue().getStatus()).isEqualTo(TransactionStatus.APPROVED.getValue());
    }

    @Test
    @DisplayName("Given a value of zero, the transaction should be APPROVED")
    void execute_whenValueIsZero_shouldApprove() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(3L, "ext-003", BigDecimal.ZERO);

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort).sendTransactionProcessed(captor.capture());

        assertThat(captor.getValue().getStatus()).isEqualTo(TransactionStatus.APPROVED.getValue());
    }

    // -------------------------------------------------------------------------
    // Tests: REJECTED transaction (value > 1000)
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Given a value above the threshold (1000.01), the transaction should be REJECTED")
    void execute_whenValueAboveThreshold_shouldReject() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(4L, "ext-004", new BigDecimal("1000.01"));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort).sendTransactionProcessed(captor.capture());

        EventOutbound outbound = captor.getValue();
        assertThat(outbound.getStatus()).isEqualTo(TransactionStatus.REJECTED.getValue());
        assertThat(outbound.getId()).isEqualTo(4L);
        assertThat(outbound.getTransactionExternalId()).isEqualTo("ext-004");
    }

    @Test
    @DisplayName("Given a very high value (9999), the transaction should be REJECTED")
    void execute_whenValueVeryHigh_shouldReject() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(5L, "ext-005", new BigDecimal("9999"));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort).sendTransactionProcessed(captor.capture());

        assertThat(captor.getValue().getStatus()).isEqualTo(TransactionStatus.REJECTED.getValue());
    }

    // -------------------------------------------------------------------------
    // Tests: producer error propagation
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("If the producer fails, the Mono should propagate the error")
    void execute_whenProducerFails_shouldPropagateError() {
        EventInbound message = buildEventInbound(6L, "ext-006", new BigDecimal("500"));
        RuntimeException producerError = new RuntimeException("Kafka not available");

        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class)))
                .thenReturn(Mono.error(producerError));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .expectErrorMatches(err -> err instanceof RuntimeException
                        && err.getMessage().equals("Kafka not available"))
                .verify();
    }

    // -------------------------------------------------------------------------
    // Tests: EventOutbound field mapping
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("The EventOutbound should contain the same id, transactionExternalId and value as the EventInbound")
    void execute_shouldMapEventInboundFieldsToEventOutbound() {
        Long expectedId = 7L;
        String expectedExtId = "ext-007";
        BigDecimal expectedValue = new BigDecimal("250");
        EventInbound message = buildEventInbound(expectedId, expectedExtId, expectedValue);
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        ArgumentCaptor<EventOutbound> captor = ArgumentCaptor.forClass(EventOutbound.class);
        verify(kafkaProducerPort).sendTransactionProcessed(captor.capture());

        EventOutbound outbound = captor.getValue();
        assertThat(outbound.getId()).isEqualTo(expectedId);
        assertThat(outbound.getTransactionExternalId()).isEqualTo(expectedExtId);
        assertThat(outbound.getValue()).isEqualByComparingTo(expectedValue);
    }

    @Test
    @DisplayName("The producer should be invoked exactly once per execution")
    void execute_shouldCallProducerExactlyOnce() {
        when(kafkaProducerPort.sendTransactionProcessed(any(EventOutbound.class))).thenReturn(Mono.empty());
        EventInbound message = buildEventInbound(8L, "ext-008", new BigDecimal("100"));

        StepVerifier.create(validateAntiFraudService.execute(message))
                .verifyComplete();

        verify(kafkaProducerPort, times(1)).sendTransactionProcessed(any(EventOutbound.class));
    }
}
