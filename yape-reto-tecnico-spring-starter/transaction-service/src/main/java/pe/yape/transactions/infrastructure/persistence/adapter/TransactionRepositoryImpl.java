package pe.yape.transactions.infrastructure.persistence.adapter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;
import pe.yape.transactions.domain.model.Transaction;
import pe.yape.transactions.domain.model.TransactionStatus;
import pe.yape.transactions.domain.repository.TransactionRepository;
import pe.yape.transactions.infrastructure.persistence.entity.TransactionEntity;
import pe.yape.transactions.infrastructure.persistence.jpa.SpringDataTransactionRepository;

@Repository
public class TransactionRepositoryImpl implements TransactionRepository {

    private final SpringDataTransactionRepository jpa;

    public TransactionRepositoryImpl(SpringDataTransactionRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        return jpa.findByTransactionExternalId(transactionExternalId).map(this::toDomain);
    }

    @Override
    public Transaction save(Transaction t) {

        TransactionEntity e = jpa.findByTransactionExternalId(t.getTransactionExternalId())
                .orElseGet(TransactionEntity::new);

        e.setTransactionExternalId(t.getTransactionExternalId());
        e.setAccountExternalIdDebit(t.getAccountExternalIdDebit());
        e.setAccountExternalIdCredit(t.getAccountExternalIdCredit());
        e.setTranferTypeId(t.getTranferTypeId());
        e.setValue(t.getValue());

        TransactionStatus status = (t.getStatus() != null) ? t.getStatus() : TransactionStatus.PENDING;
        e.setStatus(status);

        e.setAntifraudScore(t.getAntifraudScore());

        if (e.getCreatedAt() == null) {
            e.setCreatedAt(t.getCreatedAt() != null ? t.getCreatedAt() : LocalDateTime.now());
        }

        TransactionEntity saved = jpa.save(e);
        return toDomain(saved);
    }

    @Override
    public List<Transaction> findAll() {
        return jpa.findAll().stream().map(this::toDomain).toList();
    }

    private Transaction toDomain(TransactionEntity e) {
        Transaction t = new Transaction(
                e.getTransactionExternalId(),
                e.getAccountExternalIdDebit(),
                e.getAccountExternalIdCredit(),
                e.getTranferTypeId(),
                e.getValue()
        );

        t.setCreatedAt(e.getCreatedAt());

        if (e.getStatus() != null) {
            TransactionStatus st = TransactionStatus.valueOf(e.getStatus().name().toString());
            if (st == TransactionStatus.APPROVED) {
                t.approve(e.getAntifraudScore() == null ? 0 : e.getAntifraudScore());
            } else if (st == TransactionStatus.REJECTED) {
                t.reject(e.getAntifraudScore() == null ? 0 : e.getAntifraudScore());
            }
        }

        return t;
    }
}