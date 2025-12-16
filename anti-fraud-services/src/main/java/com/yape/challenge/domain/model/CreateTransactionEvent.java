package com.yape.challenge.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateTransactionEvent {
    private String transactionId;
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private int transferTypeId;
    private Double value;
}
