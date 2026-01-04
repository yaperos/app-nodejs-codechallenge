package com.yape.challenge.transaction;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(
        properties = {
                "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}",
                "spring.kafka.consumer.group-id=test-app-group",
                "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;CASE_INSENSITIVE_IDENTIFIERS=TRUE;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.sql.init.mode=never",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
                "spring.cache.type=none",
                "spring.data.redis.repositories.enabled=false"
        }
)
@EmbeddedKafka(
        partitions = 1,
        topics = {"transaction-created", "transaction-status-updated"}
)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@DisplayName("Transaction Service Application Tests")
class TransactionServiceApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Should load application context")
    void shouldLoadApplicationContext() {
        assertNotNull(applicationContext);
    }

    @Test
    @DisplayName("Should have transaction repository bean")
    void shouldHaveTransactionRepositoryBean() {
        assertTrue(applicationContext.containsBean("transactionRepository"));
    }

    @Test
    @DisplayName("Should have event store bean")
    void shouldHaveEventStoreBean() {
        assertTrue(applicationContext.containsBean("eventStore"));
    }

    @Test
    @DisplayName("Should have transaction aggregate service bean")
    void shouldHaveTransactionAggregateServiceBean() {
        assertTrue(applicationContext.containsBean("transactionAggregateService"));
    }

    @Test
    @DisplayName("Should have kafka template bean")
    void shouldHaveKafkaTemplateBean() {
        assertNotNull(applicationContext.getBean(KafkaTemplate.class));
    }

    @Test
    @DisplayName("Should have command bus bean")
    void shouldHaveCommandBusBean() {
        assertTrue(applicationContext.containsBean("commandBus"));
    }

    @Test
    @DisplayName("Should have query bus bean")
    void shouldHaveQueryBusBean() {
        assertTrue(applicationContext.containsBean("queryBus"));
    }

    @Test
    @DisplayName("Should have transaction status consumer bean")
    void shouldHaveTransactionStatusConsumerBean() {
        assertTrue(applicationContext.containsBean("transactionStatusConsumer"));
    }

    @Test
    @DisplayName("Should have kafka producer service bean")
    void shouldHaveKafkaProducerServiceBean() {
        assertTrue(applicationContext.containsBean("kafkaProducerService"));
    }
}

