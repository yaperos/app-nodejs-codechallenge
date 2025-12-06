package com.jotace.transaction.infrastructure.adapter.out;

import com.jotace.transaction.application.port.out.TransactionRepositoryPort;
import com.jotace.transaction.domain.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class JpaTransactionAdapter implements TransactionRepositoryPort {

    private final TransactionRepository jpaRepository;

    public JpaTransactionAdapter(TransactionRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    // Domain to Infrastructure
    private TransactionEntity toEntity(Transaction domain) {
        return new TransactionEntity(
                domain.transactionExternalId(),
                domain.accountExternalIdDebit(),
                domain.accountExternalIdCredit(),
                domain.tranferTypeId(),
                domain.value(),
                domain.transactionStatus(),
                domain.createdAt()
        );
    }

    // Infrastructure to Domain
    private Transaction toDomain(TransactionEntity entity) {
        return new Transaction(
                entity.getTransactionExternalId(),
                entity.getAccountExternalIdDebit(),
                entity.getAccountExternalIdCredit(),
                entity.getTransferTypeId(),
                entity.getValue(),
                entity.getTransactionStatus(),
                entity.getCreatedAt()
        );
    }

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = toEntity(transaction);
        TransactionEntity savedEntity = jpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        return jpaRepository.findByTransactionExternalId(transactionExternalId)
                .map(this::toDomain);
    }

    @Override
    public void updateStatus(UUID transactionExternalId, String newStatus) {
        TransactionEntity entity = jpaRepository.findByTransactionExternalId(
                transactionExternalId
        ).orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        entity.setTransactionStatus(newStatus);

        TransactionEntity saved = jpaRepository.save(entity);

        toDomain(saved);
    }

}
