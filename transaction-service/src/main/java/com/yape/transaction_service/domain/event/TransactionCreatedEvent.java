package com.yape.transaction_service.domain.event;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionCreatedEvent {

    private UUID transactionExternalId;
    private BigDecimal value;

}
