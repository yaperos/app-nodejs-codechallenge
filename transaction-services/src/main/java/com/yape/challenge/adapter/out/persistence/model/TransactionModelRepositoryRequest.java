package com.yape.challenge.adapter.out.persistence.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Getter
@Setter
public class TransactionModelRepositoryRequest {
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private String transferTypeId;
    private BigDecimal value;
    private String status;
}
