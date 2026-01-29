package com.tec.yape.transaction.infrastructure.adapter;

import com.tec.yape.transaction.domain.model.TransactionCreatedEvent;
import com.tec.yape.transaction.domain.port.output.TransactionEventPublisherOutPort;
import com.tec.yape.transaction.infrastructure.messaging.producer.TransactionEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionPublisherAdapter implements TransactionEventPublisherOutPort {

    private final TransactionEventPublisher transactionEventPublisher;

    @Override
    public void publish(TransactionCreatedEvent transaction) {
        transactionEventPublisher.publish(transaction);
    }
}
