package pe.com.yape.orchestrator.application.exception;

/**
 * Excepción personalizada cuadno hay un error con transaction-service
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public class TransactionServiceException extends RuntimeException {
    
    public TransactionServiceException(String message) {
        super(message);
    }
    
    public TransactionServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

