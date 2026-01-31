package com.yape.anti_fraud_service.domain.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private UUID transactionExternalId;
    private String status;
}
