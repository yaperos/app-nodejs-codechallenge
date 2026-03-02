package com.yape.transaction.domain.ports;

import com.yape.transaction.domain.model.EventOutbound;
import reactor.core.publisher.Mono;

public interface KafkaProducerPort {
    Mono<Void> sendValidate(EventOutbound eventOutbound);
}
