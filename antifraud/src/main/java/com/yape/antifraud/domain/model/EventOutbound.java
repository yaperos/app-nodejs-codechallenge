package com.yape.antifraud.domain.model;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class EventOutbound {
    private Long id;
    private BigDecimal value;
    private String transactionExternalId;
    private String status;
}

