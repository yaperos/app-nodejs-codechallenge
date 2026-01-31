package com.devpull.transactionservice.application.dto.result;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;

import java.util.UUID;

public record AccountResult(
        UUID id,
        AccountStatus accountStatus,
        AccountType accountType
) {}
