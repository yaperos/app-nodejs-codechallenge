package com.yape.transaction.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class GetTransactionResponse {
    private String transactionExternalId;
    private BaseTransaction transactionType;
    private BaseTransaction transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;
}
