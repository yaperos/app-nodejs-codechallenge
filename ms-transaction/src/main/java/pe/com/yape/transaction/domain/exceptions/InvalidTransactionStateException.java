package pe.com.yape.transaction.domain.exceptions;

public class InvalidTransactionStateException extends RuntimeException {

    public InvalidTransactionStateException(String message) {
        super(message);
    }
}
