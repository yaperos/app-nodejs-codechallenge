package com.pe.yape.service.challenge.transactions.httpclient.dto;

public record CreateTransactionRequest(String accountExternalIdDebit,
                                       String accountExternalIdCredit,
                                       Integer transferTypeId,
                                       Double value) {
}
