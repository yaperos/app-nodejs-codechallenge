package com.devpull.transactionservice.infrastructure.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
@Order(-2) // to catch it early
public class GlobalExceptionHandler {

    private final ApiExceptionMapper mapper;

    public GlobalExceptionHandler(ApiExceptionMapper mapper) {
        this.mapper = mapper;
    }

    /**
     * Validation @Valid in WebFlux normally throw WebExchangeBindException.
     */
    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleValidation(
            WebExchangeBindException ex,
            ServerWebExchange exchange
    ) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fe : ex.getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        return Mono.just(mapper.toValidationResponse(errors, exchange));
    }

    /**
     * Handler global: map any know exception or unknown to proper response.
     */
    @ExceptionHandler(Throwable.class)
    public Mono<ResponseEntity<ErrorDetails>> handleAny(Throwable ex, ServerWebExchange exchange) {
        return Mono.just(mapper.toResponse(ex, exchange));
    }
}
