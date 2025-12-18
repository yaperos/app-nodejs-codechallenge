package com.yape.transactions.builder;

import com.yape.transactions.domain.TransactionStatus;
import com.yape.transactions.dto.CreateTransactionRequest;
import com.yape.transactions.dto.TransactionCreatedEvent;
import com.yape.transactions.dto.TransactionResponse;
import com.yape.transactions.entity.TransactionEntity;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class TransactionBuilder {

    public TransactionEntity transactionEntityBuilder(CreateTransactionRequest createTransactionRequest) {
        Instant now = Instant.now();
        UUID transactionExternalId = UUID.randomUUID();

        TransactionEntity transactionEntity = new TransactionEntity();
        transactionEntity.setTransactionExternalId(transactionExternalId);
        transactionEntity.setAccountExternalIdDebit(createTransactionRequest.accountExternalIdDebit());
        transactionEntity.setAccountExternalIdCredit(createTransactionRequest.accountExternalIdCredit());
        transactionEntity.setTransactionTypeId(createTransactionRequest.tranferTypeId());
        transactionEntity.setTransactionStatus(TransactionStatus.PENDING);
        transactionEntity.setValue(createTransactionRequest.value());
        transactionEntity.setCreatedAt(now);
        return transactionEntity;
    }

    public TransactionCreatedEvent transactionCreatedEventBuilder(
            TransactionEntity transactionEntity, CreateTransactionRequest createTransactionRequest) {
        return new TransactionCreatedEvent(
                transactionEntity.getTransactionExternalId(),
                createTransactionRequest.accountExternalIdDebit(),
                createTransactionRequest.accountExternalIdCredit(),
                createTransactionRequest.tranferTypeId(),
                createTransactionRequest.value(),
                transactionEntity.getCreatedAt()
        );
    }

    public TransactionResponse transactionResponseBuilder(
            TransactionEntity transactionEntity) {
        return new TransactionResponse(
                transactionEntity.getTransactionExternalId(),
                new TransactionResponse.TransactionStatusDto(transactionEntity.getTransactionStatus().name()),
                transactionEntity.getValue(),
                transactionEntity.getCreatedAt()
        );
    }
}
