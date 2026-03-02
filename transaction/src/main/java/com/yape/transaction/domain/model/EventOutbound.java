package com.yape.transaction.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventOutbound {
    private Long id;
    private BigDecimal value;
    private String transactionExternalId;
    private String status;
}

