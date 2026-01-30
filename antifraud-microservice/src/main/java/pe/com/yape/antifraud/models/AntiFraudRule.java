package pe.com.yape.antifraud.models;

import pe.com.yape.antifraud.kafka.events.TransactionCreatedEvent;

public interface AntiFraudRule {

    boolean isFraud(TransactionCreatedEvent event);

}