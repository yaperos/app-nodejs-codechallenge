package com.devpull.transactionservice.adapter.in.web.mapper;

import com.devpull.transactionservice.adapter.in.web.dto.AccountRequest;
import com.devpull.transactionservice.adapter.in.web.dto.AccountResponse;
import com.devpull.transactionservice.application.dto.command.CreateAccountCommand;
import com.devpull.transactionservice.application.dto.result.AccountResult;

public final class AccountWebMapper {

    private AccountWebMapper() {}

    /**
     * Web -> Application
     */
    public static CreateAccountCommand toCommand(AccountRequest request) {
        return new CreateAccountCommand(
                request.accountStatus(),
                request.accountType()
        );
    }

    /**
     * Application -> Web
     */
    public static AccountResponse toResponse(AccountResult result) {
        return new AccountResponse(
                result.id(),
                result.accountStatus(),
                result.accountType()
        );
    }
}
