package com.devpull.transactionservice.adapter.in.web.dto;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;

import java.util.UUID;

public record AccountResponse(
        UUID id,
        AccountStatus accountStatus,
        AccountType accountType
) {}
