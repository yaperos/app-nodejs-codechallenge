package com.yape.challenge.adapter.out.persistence.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Getter
@Setter
public class TransactionValidationRepositoryRequest {
    private UUID transactionId;
    private String status;
}
