package com.pe.yape.service.challenge.transactions.messaging;


import com.pe.yape.service.challenge.transactions.avro.TransactionCreatedEvent;
import com.pe.yape.service.challenge.transactions.domain.model.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;
import reactor.kafka.sender.SenderRecord;
import reactor.kafka.sender.SenderResult;

import static com.pe.yape.service.challenge.transactions.config.KafkaReactiveConfig.TOPIC_TRANSACTIONS_CREATED;

@Component
@Slf4j
public class TransactionCreatedProducer {

    private final KafkaSender<String, TransactionCreatedEvent> sender;

    public TransactionCreatedProducer(SenderOptions<String, TransactionCreatedEvent> senderOptions) {
        this.sender = KafkaSender.create(senderOptions);
    }

    public Mono<String> publish(Transaction transaction) {

        TransactionCreatedEvent transactionCreatedEvent = TransactionCreatedEvent.newBuilder()
                .setTransactionExternalId(transaction.getTransactionExternalId().toString())
                .setAccountExternalIdCredit(transaction.getAccountExternalIdCredit().toString())
                .setAccountExternalIdDebit(transaction.getAccountExternalIdDebit().toString())
                .setValue(transaction.getValue())
                .setTransferTypeId(transaction.getTransferTypeId())
                .build();

        SenderRecord<String, TransactionCreatedEvent, String> record =
            SenderRecord.create(TOPIC_TRANSACTIONS_CREATED, null, null,
                    transactionCreatedEvent.getTransactionExternalId().toString(),
                    transactionCreatedEvent,
                    transactionCreatedEvent.getTransactionExternalId().toString());


        return sender.send(Mono.just(record))
                .doOnNext(result -> log.info("Send message {} to {}" , transactionCreatedEvent.getTransactionExternalId() , transactionCreatedEvent) )
                .map(SenderResult::correlationMetadata)
                .single();
    }
}
