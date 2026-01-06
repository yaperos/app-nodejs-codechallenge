package pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.mapper;

import org.springframework.stereotype.Component;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.TransactionStatus;
import pe.com.yape.transaction.domain.model.valueObjects.AccountExternalId;
import pe.com.yape.transaction.domain.model.valueObjects.Amount;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.model.valueObjects.TransferTypeId;
import pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.entity.TransactionEntity;

@Component
public class TransactionEntityMapper {

    public TransactionEntity toEntity(Transaction transaction) {
        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(transaction.getTransactionExternalId().getValue());
        entity.setAccountExternalIdDebit(transaction.getAccountExternalIdDebit().getValue());
        entity.setAccountExternalIdCredit(transaction.getAccountExternalIdCredit().getValue());
        entity.setTransferTypeId(transaction.getTransferTypeId().getValue());
        entity.setValue(transaction.getAmount().getValue());
        entity.setStatus(transaction.getStatus().getName());
        entity.setCreatedAt(transaction.getCreatedAt());
        entity.setUpdatedAt(transaction.getUpdatedAt());
        return entity;
    }

    public Transaction toDomain(TransactionEntity entity) {
        return Transaction.builder()
                .transactionExternalId(TransactionId.of(entity.getTransactionExternalId().toString()))
                .accountExternalIdDebit(AccountExternalId.of(entity.getAccountExternalIdDebit().toString()))
                .accountExternalIdCredit(AccountExternalId.of(entity.getAccountExternalIdCredit().toString()))
                .transferTypeId(TransferTypeId.of(entity.getTransferTypeId()))
                .amount(Amount.of(entity.getValue()))
                .status(TransactionStatus.fromName(entity.getStatus()))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }


}
