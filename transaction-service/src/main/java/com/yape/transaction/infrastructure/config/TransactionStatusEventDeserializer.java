package com.yape.transaction.infrastructure.config;

import com.yape.transaction.infrastructure.adapter.in.messaging.TransactionStatusEvent;
import io.quarkus.kafka.client.serialization.ObjectMapperDeserializer;

/**
 * Custom deserializer for TransactionStatusEvent.
 */
public class TransactionStatusEventDeserializer extends ObjectMapperDeserializer<TransactionStatusEvent> {
    
    public TransactionStatusEventDeserializer() {
        super(TransactionStatusEvent.class);
    }
}
