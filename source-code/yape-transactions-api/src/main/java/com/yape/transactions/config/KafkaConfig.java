package com.yape.transactions.config;

import com.yape.transactions.dto.TransactionValidatedEvent;
import org.apache.kafka.common.TopicPartition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
@EnableKafka
public class KafkaConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TransactionValidatedEvent> transactionValidatedListenerFactory(
            ConsumerFactory<String, TransactionValidatedEvent> consumerFactory,
            CommonErrorHandler commonErrorHandler,
            @Value("${app.kafka.listener.concurrency:3}") int concurrency
    ) {
        ConcurrentKafkaListenerContainerFactory<String, TransactionValidatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setConcurrency(concurrency);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        factory.setCommonErrorHandler(commonErrorHandler);
        return factory;
    }

    @Bean
    public CommonErrorHandler commonErrorHandler(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.retry.backoff-ms}") long backoffMs,
            @Value("${app.retry.max-attempts}") long maxAttempts,
            @Value("${app.topics.transaction-validated-dlt}") String dltTransactionValidatedTopic
    ) {
        var recoverer = new DeadLetterPublishingRecoverer(
                kafkaTemplate,
                (record, ex) -> new TopicPartition(dltTransactionValidatedTopic, record.partition())
        );

        DefaultErrorHandler handler =
                new DefaultErrorHandler(recoverer, new FixedBackOff(backoffMs, maxAttempts - 1));
        handler.setAckAfterHandle(true);
        return handler;
    }
}
