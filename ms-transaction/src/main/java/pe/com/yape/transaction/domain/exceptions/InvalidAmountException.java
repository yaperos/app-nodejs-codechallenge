package pe.com.yape.transaction.domain.exceptions;

public class InvalidAmountException extends RuntimeException {

    public InvalidAmountException(String message) {
        super(message);
    }
}
