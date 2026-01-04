package com.yape.challenge.antifraud;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.kafka.bootstrap-servers=localhost:9092",
        "spring.kafka.consumer.group-id=test-group"
})
@DisplayName("AntiFraud Application Tests")
class AntiFraudApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Should load application context")
    void shouldLoadApplicationContext() {
        assertNotNull(applicationContext);
    }

    @Test
    @DisplayName("Should have antifraud service bean")
    void shouldHaveAntiFraudServiceBean() {
        assertTrue(applicationContext.containsBean("antiFraudService"));
    }

    @Test
    @DisplayName("Should have transaction created consumer bean")
    void shouldHaveTransactionCreatedConsumerBean() {
        assertTrue(applicationContext.containsBean("transactionCreatedConsumer"));
    }

    @Test
    @DisplayName("Should have kafka template bean")
    void shouldHaveKafkaTemplateBean() {
        assertNotNull(applicationContext.getBean(KafkaTemplate.class));
    }
}

