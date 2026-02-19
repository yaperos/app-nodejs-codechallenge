package com.yape.yape.infrastructure.handler;

import com.yape.yape.domain.exception.TransactionAlreadyFinalizedException;
import com.yape.yape.domain.exception.TransactionNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(TransactionNotFoundException.class)
    public ProblemDetail handleNotFound(TransactionNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setTitle("Transaction not found");
        problem.setDetail(ex.getMessage());
        return problem;
    }

    @ExceptionHandler(TransactionAlreadyFinalizedException.class)
    public ProblemDetail handleFinalized(TransactionAlreadyFinalizedException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problem.setTitle("Transaction already finalized");
        problem.setDetail(ex.getMessage());
        return problem;
    }

}
