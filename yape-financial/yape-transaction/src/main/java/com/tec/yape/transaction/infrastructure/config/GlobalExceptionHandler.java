package com.tec.yape.transaction.infrastructure.config;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.tec.yape.transaction.domain.exception.CommonErrorType;
import com.tec.yape.transaction.domain.exception.TransactionException;
import com.tec.yape.transaction.infrastructure.config.dto.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> validationExceptionHandler(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse(CommonErrorType.COMMON_ERROR_400_2.getDescription());

        ErrorDto error = ErrorDto.builder()
                .status(HttpStatus.BAD_REQUEST)
                .code( CommonErrorType.COMMON_ERROR_400_1.name())
                .message(message)
                .build();

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorDto> handleInvalidFormat(HttpMessageNotReadableException ex) {

        String message = "Malformed JSON request";

        if (ex.getCause() instanceof InvalidFormatException invalidFormat) {
            String fieldName = invalidFormat.getPath().stream()
                    .map(JsonMappingException.Reference::getFieldName)
                    .findFirst()
                    .orElse("unknown");

            message = String.format(CommonErrorType.COMMON_ERROR_400_3.getDescription()+ " '%s'", fieldName);
        }

        ErrorDto error = ErrorDto.builder()
                .status(HttpStatus.BAD_REQUEST)
                .code(CommonErrorType.COMMON_ERROR_400_3.name())
                .message(message)
                .build();

        return ResponseEntity.badRequest().body(error);
    }
}
