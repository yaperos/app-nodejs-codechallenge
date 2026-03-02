package com.yape.antifraud.domain.ports;

import com.yape.antifraud.domain.model.EventOutbound;
import reactor.core.publisher.Mono;

public interface KafkaProducerPort {
    Mono<Void> sendTransactionProcessed(EventOutbound eventOutbound);
}
