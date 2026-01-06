package pe.com.yape.orchestrator.application.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando una transacción no es encontrada
 * @author lmarusic
 */
public class TransactionNotFoundException extends RuntimeException {
    
    private final UUID transactionId;
    
    public TransactionNotFoundException(UUID transactionId) {
        super("Transaction not found with ID: " + transactionId);
        this.transactionId = transactionId;
    }
    
    public UUID getTransactionId() {
        return transactionId;
    }
}

