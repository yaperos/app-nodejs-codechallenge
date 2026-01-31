package com.devpull.transactionservice.adapter.in.web.dto;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;
import jakarta.validation.constraints.NotNull;

public record AccountRequest(
        @NotNull AccountStatus accountStatus,
        @NotNull AccountType accountType
) {}
