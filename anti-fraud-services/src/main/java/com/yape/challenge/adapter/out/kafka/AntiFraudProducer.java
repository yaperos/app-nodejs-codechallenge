package com.yape.challenge.adapter.out.kafka;

import com.pe.yape.service.challenge.kafka.avro.ValidateTransactionMessageEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Configuration
@Component
@RequiredArgsConstructor
@Slf4j
public class AntiFraudProducer {

    private final KafkaTemplate<String, ValidateTransactionMessageEvent> kafkaTemplate;

    @Value("${spring.kafka.producer.topic}")
    private String topic;

    public void sendTransactionEvent(ValidateTransactionMessageEvent event) {

        log.info("Enviando evento Avro a Kafka - TransactionId: {}", event.getTransactionId());
        kafkaTemplate
                .send(topic, event.getTransactionId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Error enviando evento Avro a Kafka", ex);
                    } else {
                        log.info(
                                "Evento Avro enviado - Topic: {}, Partition: {}, Offset: {}, Key: {}",
                                result.getRecordMetadata().topic(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset(),
                                event.getTransactionId()
                        );
                    }
                });
    }
}
