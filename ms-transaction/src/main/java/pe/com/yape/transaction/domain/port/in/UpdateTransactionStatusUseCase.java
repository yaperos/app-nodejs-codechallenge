package pe.com.yape.transaction.domain.port.in;

import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;

public interface UpdateTransactionStatusUseCase {

    void approve(TransactionId transactionId);

    void reject(TransactionId transactionId);
}
