package com.jotace.transaction.infrastructure.adapter.in.rest.dto;

// Public Record for the request body. Used by the REST Controller.
public record TransactionRequest(
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        int tranferTypeId,
        double value
) {
}