package com.yape.antifraud.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EventInbound {
    private Long id;
    private String transactionExternalId;
    private BigDecimal value;
    private String status;
}

