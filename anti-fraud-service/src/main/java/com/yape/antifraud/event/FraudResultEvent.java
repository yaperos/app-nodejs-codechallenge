package com.yape.antifraud.event;

import com.yape.antifraud.domain.TransactionStatus;
import com.yape.antifraud.domain.TransactionType;
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
