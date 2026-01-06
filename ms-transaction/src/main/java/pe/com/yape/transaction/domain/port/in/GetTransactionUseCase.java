package pe.com.yape.transaction.domain.port.in;

import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;

public interface GetTransactionUseCase {

    Transaction getById(TransactionId transactionId);
}
