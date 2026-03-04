package com.yape.business.financial.infrastructure.events;

public interface TransactionEvent {
    default String eventName() {
        return this.getClass().getSimpleName();
    }
}
