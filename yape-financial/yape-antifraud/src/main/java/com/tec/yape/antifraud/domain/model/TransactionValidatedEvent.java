package com.tec.yape.antifraud.domain.model;


import com.tec.yape.antifraud.domain.enums.TransactionStatus;

import java.util.UUID;

public record TransactionValidatedEvent(
        UUID transactionExternalId,
        TransactionStatus status
) {}