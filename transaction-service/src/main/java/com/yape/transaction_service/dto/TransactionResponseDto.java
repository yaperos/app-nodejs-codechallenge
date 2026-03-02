package com.yape.transaction_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDto {

    private UUID transactionExternalId;
    private TypeName transactionType;
    private StatusName transactionStatus;
    private BigDecimal value;
    private Instant createdAt;
}
