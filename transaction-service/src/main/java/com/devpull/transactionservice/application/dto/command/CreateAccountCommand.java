package com.devpull.transactionservice.application.dto.command;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;

public record CreateAccountCommand(
        AccountStatus accountStatus,
        AccountType accountType
) {}
