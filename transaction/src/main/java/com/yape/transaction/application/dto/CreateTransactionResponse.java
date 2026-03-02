package com.yape.transaction.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateTransactionResponse {
    private String transactionExternalId;
}
