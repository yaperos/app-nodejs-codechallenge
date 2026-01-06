package pe.com.yape.transaction.domain.port.out;

import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;

import java.util.Optional;

public interface TransactionRepositoryPort {

    Transaction save(Transaction transaction);
    Optional<Transaction> findById(TransactionId transactionId);
    Transaction update(Transaction transaction);
}
