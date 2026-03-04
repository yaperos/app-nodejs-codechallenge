package com.yape.business.financial.infrastructure.events.command;

import com.yape.shared.domain.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UpdateTransactionStatusCommand implements CommandInterface {
    private UUID id;
    private TransactionStatus status;
}
