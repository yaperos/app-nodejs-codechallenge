package com.yape.challenge.antifraud.integration;

import com.yape.challenge.antifraud.config.TestKafkaProducerConfig;
import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.common.kafka.KafkaTopics;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.ContainerTestUtils;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}")
@Import(TestKafkaProducerConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@EmbeddedKafka(
        partitions = 3,
        topics = {KafkaTopics.TRANSACTION_CREATED, KafkaTopics.TRANSACTION_STATUS_UPDATED}
)
@DisplayName("AntiFraud Service Integration Tests")
class AntiFraudServiceIntegrationTest {

    @Autowired
    private KafkaTemplate<String, TransactionCreatedEvent> producerTemplate;

    private KafkaMessageListenerContainer<String, TransactionStatusEvent> container;
    private BlockingQueue<ConsumerRecord<String, TransactionStatusEvent>> records;

    @BeforeEach
    void setUp() {
        records = new LinkedBlockingQueue<>();

        Map<String, Object> consumerProps = new HashMap<>();
        consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, System.getProperty("spring.embedded.kafka.brokers"));
        consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, "test-integration-group");
        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumerProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        consumerProps.put(JsonDeserializer.VALUE_DEFAULT_TYPE, TransactionStatusEvent.class.getName());

        DefaultKafkaConsumerFactory<String, TransactionStatusEvent> consumerFactory =
                new DefaultKafkaConsumerFactory<>(consumerProps);

        ContainerProperties containerProperties = new ContainerProperties(KafkaTopics.TRANSACTION_STATUS_UPDATED);
        container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.setupMessageListener((MessageListener<String, TransactionStatusEvent>) records::add);
        container.start();
        ContainerTestUtils.waitForAssignment(container, 3);
    }

    @AfterEach
    void tearDown() {
        if (container != null) {
            container.stop();
        }
    }

    @Test
    @DisplayName("Should approve transaction when value is below threshold")
    void shouldApproveTransactionWhenValueIsBelowThreshold() throws InterruptedException {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        // When
        producerTemplate.send(KafkaTopics.TRANSACTION_CREATED, transactionId.toString(), event);

        // Then
        ConsumerRecord<String, TransactionStatusEvent> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received, "Should receive a status event");

        TransactionStatusEvent statusEvent = received.value();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.APPROVED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should reject transaction when value exceeds threshold")
    void shouldRejectTransactionWhenValueExceedsThreshold() throws InterruptedException {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("2000.00"))
                .build();

        // When
        producerTemplate.send(KafkaTopics.TRANSACTION_CREATED, transactionId.toString(), event);

        // Then
        ConsumerRecord<String, TransactionStatusEvent> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received, "Should receive a status event");

        TransactionStatusEvent statusEvent = received.value();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.REJECTED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should process multiple transactions in sequence")
    void shouldProcessMultipleTransactionsInSequence() throws InterruptedException {
        // Given
        UUID transactionId1 = UUID.randomUUID();
        UUID transactionId2 = UUID.randomUUID();

        TransactionCreatedEvent event1 = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId1)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        TransactionCreatedEvent event2 = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId2)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("1500.00"))
                .build();

        // When
        producerTemplate.send(KafkaTopics.TRANSACTION_CREATED, transactionId1.toString(), event1);
        producerTemplate.send(KafkaTopics.TRANSACTION_CREATED, transactionId2.toString(), event2);

        // Then
        ConsumerRecord<String, TransactionStatusEvent> received1 = records.poll(10, TimeUnit.SECONDS);
        ConsumerRecord<String, TransactionStatusEvent> received2 = records.poll(10, TimeUnit.SECONDS);

        assertNotNull(received1, "Should receive first status event");
        assertNotNull(received2, "Should receive second status event");

        TransactionStatusEvent statusEvent1 = received1.value();
        assertEquals(transactionId1, statusEvent1.getTransactionExternalId());
        assertEquals(TransactionStatus.APPROVED, statusEvent1.getStatus());

        TransactionStatusEvent statusEvent2 = received2.value();
        assertEquals(transactionId2, statusEvent2.getTransactionExternalId());
        assertEquals(TransactionStatus.REJECTED, statusEvent2.getStatus());
    }

    @Test
    @DisplayName("Should use transaction id as message key")
    void shouldUseTransactionIdAsMessageKey() throws InterruptedException {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        // When
        producerTemplate.send(KafkaTopics.TRANSACTION_CREATED, transactionId.toString(), event);

        // Then
        ConsumerRecord<String, TransactionStatusEvent> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received, "Should receive a status event");
        assertEquals(transactionId.toString(), received.key());
    }
}

