package com.yape.antifraud.infrastructure.config;

import com.yape.antifraud.infrastructure.adapter.in.messaging.TransactionCreatedEvent;
import io.quarkus.kafka.client.serialization.ObjectMapperDeserializer;

public class TransactionCreatedEventDeserializer extends ObjectMapperDeserializer<TransactionCreatedEvent> {
    
    public TransactionCreatedEventDeserializer() {
        super(TransactionCreatedEvent.class);
    }
}
