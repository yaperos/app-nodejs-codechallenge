package pe.com.yape.transaction.domain.exceptions;

public class TransactionNotFoundException extends RuntimeException {

    public TransactionNotFoundException(String message) {
        super(message);
    }

}
