package com.tec.yape.antifraud.infrastructure.adapter;

import com.tec.yape.antifraud.domain.model.TransactionValidatedEvent;
import com.tec.yape.antifraud.domain.port.output.TransactionStatusPublisherOutPort;
import com.tec.yape.antifraud.infrastructure.messaging.producer.TransactionStatusPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusPublisherAdapter implements TransactionStatusPublisherOutPort {

    private final TransactionStatusPublisher transactionStatusPublisher;

    @Override
    public void publish(TransactionValidatedEvent event) {
        transactionStatusPublisher.publish(event);
    }
}
