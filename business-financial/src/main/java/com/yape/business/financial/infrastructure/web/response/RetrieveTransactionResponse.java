package com.yape.business.financial.infrastructure.web.response;

import com.yape.business.financial.domain.valueobject.TransactionStatus;
import com.yape.business.financial.domain.valueobject.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class RetrieveTransactionResponse {
    private final UUID transactionExternalId;
    private final TransactionType transactionType;
    private final TransactionStatus transactionStatus;
    private final BigDecimal value;
    private final Instant createdAt;
}
