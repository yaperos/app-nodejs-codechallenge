package com.yape.challenge.adapter.out.messaging.kafka;

import com.pe.yape.service.challenge.kafka.avro.ValidateTransactionMessageEvent;
import com.yape.challenge.domain.port.in.TransactionUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;


@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerMessage {

    private final TransactionUseCase transactionUseCase;

    @KafkaListener(
            topics = "${spring.kafka.consumer.topic}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory")
    public void consume(ValidateTransactionMessageEvent event, Acknowledgment ack) {

        log.info("Mensaje Avro recibido para validación de transacción");

        transactionUseCase.validateTransaction(event)
                .doOnSuccess(response -> {
                    ack.acknowledge();
                    log.info("Mensaje procesado y offset confirmado");
                }).doOnError(error -> log.error("Error procesando mensaje Avro de Kafka", error))
                .subscribe();
    }

}
