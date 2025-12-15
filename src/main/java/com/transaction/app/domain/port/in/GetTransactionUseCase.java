package com.transaction.app.domain.port.in;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.infrastructure.controller.dto.TransactionResponse;

import java.util.UUID;

public interface GetTransactionUseCase {
    TransactionResponse getByExternalId(UUID externalId);
}
