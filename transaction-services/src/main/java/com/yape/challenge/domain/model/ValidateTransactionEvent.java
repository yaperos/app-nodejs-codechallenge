package com.yape.challenge.domain.model;

import lombok.Builder;

@Builder
public record ValidateTransactionEvent(String transactionId, String status){
}
