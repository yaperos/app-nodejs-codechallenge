package com.yape.challenge.adapter.out.messaging;

import com.yape.challenge.adapter.out.messaging.kafka.KafkaProducerMessage;
import com.yape.challenge.adapter.out.messaging.mapper.TransactionMessageMapper;
import com.yape.challenge.domain.model.CreateTransactionEvent;
import com.yape.challenge.domain.port.out.TransactionMessagingPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class TransactionMessagingAdapter implements TransactionMessagingPort {
    private final KafkaProducerMessage kafkaProducerMessage;
    private final TransactionMessageMapper transactionMessageMapper;

    @Override
    public Mono<Void> sendTransactionEvent(CreateTransactionEvent event) {
        return Mono.fromRunnable(() -> kafkaProducerMessage.sendTransactionEvent(
                        transactionMessageMapper.toMapCreatedTransactionEvent(event) ));
    }

}
