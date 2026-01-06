package com.desafio.yape.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private String transactionExternalId;
    private Type transactionType;
    private Status transactionStatus;
    private Double value;
    private LocalDateTime createdAt;

    @Data
    public static class Type { private String name; }

    @Data
    public static class Status { private String name; }
}
