package com.devpull.transactionservice.adapter.in.web.mapper;

import com.devpull.transactionservice.adapter.in.web.dto.TransactionRequest;
import com.devpull.transactionservice.adapter.in.web.dto.TransactionResponse;
import com.devpull.transactionservice.application.dto.command.CreateTransactionCommand;
import com.devpull.transactionservice.application.dto.result.TransactionResult;

public class TransactionWebMapper {

    private TransactionWebMapper() {}

    /**
     * Web → Application
     */
    public static CreateTransactionCommand toCommand(TransactionRequest request) {
        return new CreateTransactionCommand(
                request.accountExternalIdDebit(),
                request.accountExternalIdCredit(),
                request.transferTypeId(),
                request.value()
        );
    }

    /**
     * Application → Web
     */
    public static TransactionResponse toResponse(TransactionResult result) {
        return new TransactionResponse(
                result.id(),
                result.status(),
                result.type(),
                result.amount(),
                result.createdAt(),
                result.updatedAt(),
                result.accountId()
        );
    }
}
