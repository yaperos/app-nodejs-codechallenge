package com.challenge.transaction.core.domain.event;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
public class FraudResultEvent implements Serializable {

    @Serial
    private static final long serialVersionUID = 7775625147330100345L;

    private String transactionId;
    private String status;
}
