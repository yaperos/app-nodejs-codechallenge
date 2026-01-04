package com.yape.challenge.transaction.application.command;

import com.yape.challenge.common.dto.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Command to update transaction status
 */
@Data
@Builder
public class UpdateTransactionStatusCommand {
    private UUID externalId;
    private TransactionStatus status;
}

