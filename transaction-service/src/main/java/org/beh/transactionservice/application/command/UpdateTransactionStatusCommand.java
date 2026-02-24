package org.beh.transactionservice.application.command;

import lombok.Data;

import java.util.UUID;
import org.beh.transactionservice.domain.model.TransactionStatus;

@Data
public class UpdateTransactionStatusCommand {
    private UUID transactionId;
    private TransactionStatus status;
}
