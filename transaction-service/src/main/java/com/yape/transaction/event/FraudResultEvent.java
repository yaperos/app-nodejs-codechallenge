package com.yape.transaction.event;

import com.yape.transaction.domain.TransactionStatus;
import com.yape.transaction.domain.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudResultEvent {
    private String transactionId;
    private String transactionExternalId;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private Float value;
    private Instant createdAt;
}
