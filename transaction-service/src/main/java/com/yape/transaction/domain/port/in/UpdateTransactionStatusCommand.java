package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.TransactionStatus;

import java.util.UUID;

public record UpdateTransactionStatusCommand(
        UUID transactionId,
        TransactionStatus newStatus
) {}
