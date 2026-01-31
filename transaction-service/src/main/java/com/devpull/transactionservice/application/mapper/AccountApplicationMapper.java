package com.devpull.transactionservice.application.mapper;

import com.devpull.transactionservice.application.dto.result.AccountResult;
import com.devpull.transactionservice.domain.model.Account;

public final class AccountApplicationMapper {

    private AccountApplicationMapper() {}

    public static AccountResult toResult(Account account) {
        return new AccountResult(
                account.getId(),
                account.getAccountStatus(),
                account.getAccountType()
        );
    }

}
