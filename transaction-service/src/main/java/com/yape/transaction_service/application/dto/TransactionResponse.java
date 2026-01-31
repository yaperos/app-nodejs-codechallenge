package com.yape.transaction_service.application.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private UUID id;
    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private BigDecimal value;
    private LocalDateTime createdAt;

}
