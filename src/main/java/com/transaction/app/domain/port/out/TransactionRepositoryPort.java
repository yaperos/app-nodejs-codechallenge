package com.transaction.app.domain.port.out;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.model.TransactionStatus;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepositoryPort {

    TransactionModel save(TransactionModel model);

    Optional<TransactionModel> findByExternalId(UUID externalId);

    void updateStatus(UUID externalId, TransactionStatus status);
}
