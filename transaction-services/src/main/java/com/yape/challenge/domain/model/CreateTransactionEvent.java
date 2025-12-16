package com.yape.challenge.domain.model;

import lombok.Builder;

@Builder
public record CreateTransactionEvent(String transactionId, String accountExternalIdDebit,
                                     String accountExternalIdCredit,int transferTypeId, Double value){
}
