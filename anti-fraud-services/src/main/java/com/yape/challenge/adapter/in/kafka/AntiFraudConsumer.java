package com.yape.challenge.adapter.in.kafka;

import com.pe.yape.service.challenge.kafka.avro.CreatedTransactionMessageEvent;
import com.yape.challenge.domain.port.in.AntiFraudUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AntiFraudConsumer {

    private final AntiFraudUseCase antiFraudUseCase;

    @KafkaListener(
            topics = "${spring.kafka.consumer.topic}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(CreatedTransactionMessageEvent event) {
        log.info("Mensaje Avro recibido para validación antifraude");
        antiFraudUseCase.validate(event)
                .doOnError(e -> log.error("Error validando transacción", e))
                .subscribe();
    }

}



