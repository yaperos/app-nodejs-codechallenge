package com.tec.yape.antifraud.domain.port.input;

import com.tec.yape.antifraud.domain.model.TransactionCreatedEvent;

public interface FraudValidationInPort {

    void validate(TransactionCreatedEvent event);
}
