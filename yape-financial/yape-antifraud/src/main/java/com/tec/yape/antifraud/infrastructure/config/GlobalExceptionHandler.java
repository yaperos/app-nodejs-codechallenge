package com.tec.yape.antifraud.infrastructure.config;

import com.tec.yape.antifraud.infrastructure.config.dto.ErrorDto;
import com.tec.yape.antifraud.domain.exception.TransactionException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = TransactionException.class)
    public ResponseEntity<ErrorDto> businessExceptionHandler(TransactionException ex) {
        ErrorDto error = ErrorDto.builder()
                .status(ex.getStatus())
                .code(ex.getCode()).message(ex.getMessage()).build();
        return new ResponseEntity<>(error, ex.getStatus());
    }
}
