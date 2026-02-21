package com.yape.antifraud.messaging;

import com.yape.antifraud.event.TransactionEvent;
import com.yape.antifraud.service.AntiFraudService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.kafka.receiver.ReceiverRecord;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer implements ApplicationRunner {

    private final ReactiveKafkaConsumerTemplate<String, TransactionEvent> consumerTemplate;
    private final AntiFraudService antiFraudService;
    private final FraudResultPublisher fraudResultPublisher;

    @Override
    public void run(ApplicationArguments args) {
        consumerTemplate
                .receive()
                // Paralelismo por partición usando groupBy
                .groupBy(record -> record.receiverOffset().topicPartition())
                .flatMap(partitionFlux ->
                        partitionFlux
                                .publishOn(Schedulers.boundedElastic())
                                .concatMap(record -> processRecord(record)  // concatMap respeta orden por partición
                                        .doOnSuccess(v -> record.receiverOffset().acknowledge())
                                )
                )
                .subscribe(
                        null,
                        ex -> log.error("Fatal error in consumer stream", ex)
                );
    }

    private Mono<Void> processRecord(ReceiverRecord<String, TransactionEvent> record) {
        TransactionEvent event = record.value();
        log.info("Processing transaction: {}", event.getTransactionId());

        return antiFraudService
                .evaluate(event)
                .flatMap(fraudResultPublisher::publish)
                .onErrorResume(ex -> {
                    log.error("Error evaluating transaction: {}", event.getTransactionId(), ex);
                    return Mono.empty();
                });
    }
}