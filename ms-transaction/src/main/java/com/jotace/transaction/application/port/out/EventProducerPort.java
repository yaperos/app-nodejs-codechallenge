package com.jotace.transaction.application.port.out;

import com.jotace.transaction.domain.model.Transaction;

public interface EventProducerPort {

    void sendTransactionCreatedEvent(Transaction transaction);
}
