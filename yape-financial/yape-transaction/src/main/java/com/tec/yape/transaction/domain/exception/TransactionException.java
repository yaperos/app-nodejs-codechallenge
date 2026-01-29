package com.tec.yape.transaction.domain.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;

@EqualsAndHashCode(callSuper = true)
@Data
public class TransactionException extends RuntimeException {

    public HttpStatus status;
    public String code;

    public TransactionException(HttpStatus httpStatus, String code, String message) {
        super(message);
        this.status = httpStatus;
        this.code = code;
    }
}
