package pe.com.yape.ms.transaction.application.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando una transacción no es encontrada
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public class TransactionNotFoundException extends RuntimeException {
    
    private final UUID transactionExternalId;
    
    public TransactionNotFoundException(UUID transactionExternalId) {
        super(String.format("Transaction not found with ID: %s", transactionExternalId));
        this.transactionExternalId = transactionExternalId;
    }
    
    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }
}

