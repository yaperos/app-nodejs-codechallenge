package com.pe.yape.service.challenge.antifraud.messaging;


import com.pe.yape.service.challenge.transactions.avro.TransactionCreatedEvent;
import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import com.pe.yape.service.challenge.antifraud.service.AntifraudService;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.core.publisher.Flux;
import org.springframework.stereotype.Component;
import reactor.kafka.receiver.ReceiverRecord;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class TransactionCreatedConsumer {

    private final TransactionValidatedProducer producer;
    private final AntifraudService antifraudService;
    private final ReceiverOptions<String, TransactionCreatedEvent> receiverOptions;

    public TransactionCreatedConsumer(TransactionValidatedProducer producer,
                                      AntifraudService antifraudService,
                                      ReceiverOptions<String, TransactionCreatedEvent> receiverOptions) {
        this.producer = producer;
        this.antifraudService = antifraudService;
        this.receiverOptions = receiverOptions;
    }

    @PostConstruct
    public void startConsumer() {
        log.info("Starting Kafka TransactionCreatedEvent consumer...");

        Flux<ReceiverRecord<String, TransactionCreatedEvent>> kafkaFlux =
                KafkaReceiver.create(receiverOptions).receive();

        kafkaFlux.flatMap(record -> {
                    TransactionCreatedEvent transactionCreatedEvent = record.value();
                    log.debug("Received message for transaction: {}", transactionCreatedEvent.getTransactionExternalId());

                    return antifraudService.validate(transactionCreatedEvent)
                            .map(validationResult ->
                                    TransactionValidatedEvent.newBuilder()
                                            .setTransactionExternalId(transactionCreatedEvent.getTransactionExternalId())
                                            .setStatus(validationResult.getTransactionStatus().toString())
                                            .setReasonCode(validationResult.getReasonCode())
                                            .setValidatedAt(OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)) // Use ISO_OFFSET_DATE_TIME
                                            .build()
                            ).flatMap(transactionValidatedEvent ->
                                    producer.publish(transactionValidatedEvent, transactionCreatedEvent.getTransactionExternalId().toString())
                            )
                            .doOnNext(s -> {
                                record.receiverOffset().acknowledge();
                                log.info("Acknowledged transaction ID: {}", transactionCreatedEvent.getTransactionExternalId());
                            });
                })
                .subscribe(
                        result -> log.debug("Processing loop successful for a record."),
                        error -> log.error("Error during Kafka consumption process: {}", error.getMessage(), error),
                        () -> log.warn("Kafka consumer flux completed unexpectedly.")
                );
    }
}
