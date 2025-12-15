package com.transaction.app.application.usecase;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.port.in.GetTransactionUseCase;
import com.transaction.app.domain.port.out.TransactionRepositoryPort;
import com.transaction.app.infrastructure.controller.dto.TransactionResponse;
import com.transaction.app.infrastructure.controller.dto.TransactionStatusResponse;
import com.transaction.app.infrastructure.controller.dto.TransactionTypeResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class GetByIdTransactionUseCaseImpl implements GetTransactionUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    @Override
    public TransactionResponse getByExternalId(UUID externalId) {
        TransactionModel model = transactionRepositoryPort.findByExternalId(externalId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        return new TransactionResponse(
                model.getTransactionExternalId(),
                new TransactionTypeResponse("TYPE_" + model.getTranferTypeId()),
                new TransactionStatusResponse(model.getStatus().name()),
                model.getValue(),
                model.getCreatedAt()
        );
    }
}
