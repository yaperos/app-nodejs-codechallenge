package com.transaction.app.infrastructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {

    private UUID transactionExternalId;
    private TransactionTypeResponse transactionType;
    private TransactionStatusResponse transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;
}
