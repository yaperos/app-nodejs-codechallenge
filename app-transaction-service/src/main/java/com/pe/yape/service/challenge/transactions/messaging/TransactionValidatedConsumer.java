package com.pe.yape.service.challenge.transactions.messaging;


import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import com.pe.yape.service.challenge.transactions.service.TransactionService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

@Component
@Slf4j
public class TransactionValidatedConsumer {

    private final TransactionService transactionService;

    private final ReceiverOptions<String, TransactionValidatedEvent> receiverOptions;

    public TransactionValidatedConsumer(TransactionService transactionService,
                                        ReceiverOptions<String,TransactionValidatedEvent> receiverOptions) {
        this.transactionService = transactionService;
        this.receiverOptions = receiverOptions;
    }

    @PostConstruct
    private void startConsumer() {

        Flux<ReceiverRecord<String, TransactionValidatedEvent>> kafkaFlux =
                KafkaReceiver.create(receiverOptions)
                        .receive();

        kafkaFlux.flatMap(record -> {

            TransactionValidatedEvent transactionValidatedEvent = record.value();

            return transactionService.update(transactionValidatedEvent)
                    .doOnNext(s -> {
                        log.info("Update transaction {} successfully to {}" , transactionValidatedEvent.getTransactionExternalId() ,
                                transactionValidatedEvent.getStatus());
                        record.receiverOffset()
                                .acknowledge();
                    });
        }) .subscribe(
                result -> log.info("Processing loop successful for a record."),
                error -> log.error("Error during Kafka consumption process: {}", error.getMessage(), error),
                () -> log.warn("Kafka consumer flux completed unexpectedly.")
        );;
    }
}
