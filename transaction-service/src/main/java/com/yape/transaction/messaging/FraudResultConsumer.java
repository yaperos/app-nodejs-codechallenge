package com.yape.transaction.messaging;

import com.yape.transaction.event.FraudResultEvent;
import com.yape.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Component
@RequiredArgsConstructor
@Slf4j
public class FraudResultConsumer implements ApplicationRunner {

    private final ReactiveKafkaConsumerTemplate<String, FraudResultEvent> consumerTemplate;
    private final TransactionService transactionService;

    // Sink para exponer eventos via GraphQL Subscription
    private final Sinks.Many<FraudResultEvent> fraudResultSink =
            Sinks.many().multicast().onBackpressureBuffer();

    @Override
    public void run(ApplicationArguments args) {
        consumerTemplate
                .receiveAutoAck()
                .doOnNext(record -> log.info(
                        "Fraud result received: transactionId={} status={}",
                        record.value().getTransactionId(),
                        record.value().getTransactionStatus().getName()
                ))
                .flatMap(record -> transactionService
                        .updateStatus(record.value())
                        .doOnSuccess(tx -> fraudResultSink.tryEmitNext(record.value()))
                        .doOnError(e -> log.error("Error processing fraud result", e))
                        .onErrorResume(e -> Mono.empty()) // evita que el stream se rompa
                )
                .subscribe();
    }

    // Expuesto para GraphQL Subscription
    public Flux<FraudResultEvent> getFraudResultStream() {
        return fraudResultSink.asFlux();
    }
}