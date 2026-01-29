package com.tec.yape.transaction.domain.port.input;

import com.tec.yape.transaction.domain.model.TransactionValidatedEvent;

public interface TransactionUpdateInPort {
    void updateTransactionStatus(TransactionValidatedEvent event);
}