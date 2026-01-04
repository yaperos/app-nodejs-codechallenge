package com.yape.challenge.transaction.integration;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.kafka.KafkaTopics;
import com.yape.challenge.transaction.application.dto.request.CreateTransactionRequest;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.entity.TransactionType;
import com.yape.challenge.transaction.infrastructure.repository.TransactionRepository;
import com.yape.challenge.transaction.infrastructure.repository.TransactionTypeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.ContainerTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}",
                "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;CASE_INSENSITIVE_IDENTIFIERS=TRUE;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.sql.init.mode=never",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
                "spring.jpa.show-sql=true",
                "spring.cache.type=none",
                "spring.data.redis.repositories.enabled=false"
        }
)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@EmbeddedKafka(
        partitions = 3,
        topics = {KafkaTopics.TRANSACTION_CREATED, KafkaTopics.TRANSACTION_STATUS_UPDATED}
)
@DisplayName("Transaction Service Integration Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TransactionServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionTypeRepository transactionTypeRepository;

    private KafkaMessageListenerContainer<String, TransactionCreatedEvent> container;
    private BlockingQueue<ConsumerRecord<String, TransactionCreatedEvent>> records;

    @BeforeEach
    void setUp() {
        // Clean up database before each test
        transactionRepository.deleteAll();

        // Ensure transaction types exist
        if (transactionTypeRepository.count() == 0) {
            TransactionType type = new TransactionType();
            type.setName("Tipo A");
            transactionTypeRepository.save(type);
        }

        // Setup Kafka consumer for integration tests
        records = new LinkedBlockingQueue<>();

        Map<String, Object> consumerProps = new HashMap<>();
        consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, System.getProperty("spring.embedded.kafka.brokers"));
        consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, "test-integration-group-" + System.currentTimeMillis());
        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumerProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        consumerProps.put(JsonDeserializer.VALUE_DEFAULT_TYPE, TransactionCreatedEvent.class.getName());

        DefaultKafkaConsumerFactory<String, TransactionCreatedEvent> consumerFactory =
                new DefaultKafkaConsumerFactory<>(consumerProps);

        ContainerProperties containerProperties = new ContainerProperties(KafkaTopics.TRANSACTION_CREATED);
        container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.setupMessageListener((MessageListener<String, TransactionCreatedEvent>) records::add);
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
    @Order(1)
    @DisplayName("Should create transaction and publish to Kafka")
    void shouldCreateTransactionAndPublishToKafka() throws Exception {
        // Given
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        // When
        MvcResult result = mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionExternalId").exists())
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.value").value(500.00))
                .andReturn();

        // Then - Verify database
        String response = result.getResponse().getContentAsString();
        String transactionId = objectMapper.readTree(response).get("transactionExternalId").asText();

        Transaction savedTransaction = transactionRepository
                .findByExternalId(UUID.fromString(transactionId))
                .orElse(null);

        assertNotNull(savedTransaction);
        assertEquals(TransactionStatus.PENDING, savedTransaction.getStatus());

        // Then - Verify Kafka event
        ConsumerRecord<String, TransactionCreatedEvent> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received, "Should receive a Kafka event");

        TransactionCreatedEvent kafkaEvent = received.value();
        assertEquals(transactionId, kafkaEvent.getTransactionExternalId().toString());
        assertEquals(new BigDecimal("500.00"), kafkaEvent.getValue());
    }

    @Test
    @Order(2)
    @DisplayName("Should get transaction by external id")
    void shouldGetTransactionByExternalId() throws Exception {
        // Given - Create a transaction first
        Transaction transaction = Transaction.builder()
                .externalId(UUID.randomUUID())
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("300.00"))
                .status(TransactionStatus.PENDING)
                .build();
        transaction = transactionRepository.save(transaction);

        // When & Then
        mockMvc.perform(get("/api/v1/transactions/{externalId}", transaction.getExternalId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionExternalId").value(transaction.getExternalId().toString()))
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.value").value(300.00));
    }

    @Test
    @Order(3)
    @DisplayName("Should return 404 when transaction not found")
    void shouldReturn404WhenTransactionNotFound() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When & Then
        mockMvc.perform(get("/api/v1/transactions/{externalId}", nonExistentId))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(4)
    @DisplayName("Should persist transaction in event store and read model")
    void shouldPersistTransactionInEventStoreAndReadModel() throws Exception {
        // Given
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("750.00"))
                .build();

        // When
        MvcResult result = mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        // Then
        String response = result.getResponse().getContentAsString();
        String transactionId = objectMapper.readTree(response).get("transactionExternalId").asText();

        // Verify transaction exists in read model (database)
        Transaction transaction = transactionRepository
                .findByExternalId(UUID.fromString(transactionId))
                .orElse(null);

        assertNotNull(transaction);
        assertEquals(new BigDecimal("750.00"), transaction.getValue());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
    }

    @Test
    @Order(5)
    @DisplayName("Should create multiple transactions successfully")
    void shouldCreateMultipleTransactionsSuccessfully() throws Exception {
        // Given
        long initialCount = transactionRepository.count();

        CreateTransactionRequest request1 = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        CreateTransactionRequest request2 = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("200.00"))
                .build();

        // When
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated());

        // Then
        assertEquals(initialCount + 2, transactionRepository.count());

        // Verify both Kafka events
        ConsumerRecord<String, TransactionCreatedEvent> event1 = records.poll(10, TimeUnit.SECONDS);
        ConsumerRecord<String, TransactionCreatedEvent> event2 = records.poll(10, TimeUnit.SECONDS);

        assertNotNull(event1);
        assertNotNull(event2);
    }
}

