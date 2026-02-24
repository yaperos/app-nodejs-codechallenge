package pe.yape.transactions.domain.repository;

import pe.yape.transactions.domain.model.Transaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {
    Optional<Transaction> findByExternalId(UUID transactionExternalId);

    Transaction save(Transaction transaction);

    List<Transaction> findAll();
}
