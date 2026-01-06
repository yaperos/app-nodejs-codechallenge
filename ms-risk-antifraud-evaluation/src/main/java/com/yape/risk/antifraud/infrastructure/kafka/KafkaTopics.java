package com.yape.risk.antifraud.infrastructure.kafka;

public final class KafkaTopics {

    private KafkaTopics() {}

    public static final String PAYMENT_TRANSACTION_CREATED_V1 = "payment.transaction.created.v1";
    public static final String PAYMENT_TRANSACTION_VALIDATED_V1 = "payment.transaction.validated.v1";
}
