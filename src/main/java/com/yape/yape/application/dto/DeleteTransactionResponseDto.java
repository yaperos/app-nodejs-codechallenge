package com.yape.yape.application.dto;

public record DeleteTransactionResponseDto(
        String message,
        String transactionExternalId
) {}
