package com.pe.yape.service.challenge.antifraud.messaging;


import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;
import reactor.kafka.sender.SenderRecord;
import reactor.kafka.sender.SenderResult;

import static com.pe.yape.service.challenge.antifraud.config.KafkaConfig.TOPIC_TRANSACTIONS_VALIDATED;

@Component
@Slf4j
public class TransactionValidatedProducer {

    private final KafkaSender<String, TransactionValidatedEvent> sender;

    public TransactionValidatedProducer(SenderOptions<String, TransactionValidatedEvent> senderOptions) {
        this.sender = KafkaSender.create(senderOptions);
    }

    public Mono<String> publish(TransactionValidatedEvent event, String key) {
        SenderRecord<String, TransactionValidatedEvent, String> record =
            SenderRecord.create(TOPIC_TRANSACTIONS_VALIDATED, null, null, key, event, key);

        return sender.send(Mono.just(record))
                .doOnNext(result -> log.info("Send message {} to {}" , key , event) )
                .map(SenderResult::correlationMetadata)
                .ignoreElements();
    }
}
