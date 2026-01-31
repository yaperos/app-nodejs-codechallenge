package com.devpull.transactionservice.infrastructure.exception;

import com.devpull.transactionservice.domain.exception.APIException;
import com.devpull.transactionservice.domain.exception.BadRequestException;
import com.devpull.transactionservice.domain.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;

import java.util.Map;

@Component
public class ApiExceptionMapper {

    public ResponseEntity<ErrorDetails> toResponse(Throwable ex, ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();

        // Not found
        if (ex instanceof ResourceNotFoundException) {
            return build(HttpStatus.NOT_FOUND, ex.getMessage(), path, null);
        }

        // Bad request
        if (ex instanceof BadRequestException) {
            return build(HttpStatus.BAD_REQUEST, ex.getMessage(), path, null);
        }

        // APIException
        if (ex instanceof APIException apiEx) {
            HttpStatus status = apiEx.getHttpStatus() != null ? apiEx.getHttpStatus() : HttpStatus.CONFLICT;
            return build(status, apiEx.getMessage(), path, null);
        }

        // Validation / body malformed / query param not valid (WebFlux)
        // sometimes ServerWebInputException wrap binding error, decoding, etc.
        if (ex instanceof ServerWebInputException) {
            return build(HttpStatus.BAD_REQUEST, safeMessage(ex), path, null);
        }

        // If in some point launch ResponseStatusException (WebFlux normal behavior)
        if (ex instanceof ResponseStatusException rse) {
            HttpStatus status = HttpStatus.resolve(rse.getStatusCode().value());
            if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;
            return build(status, safeMessage(rse), path, null);
        }

        // Fallback
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", path, null);
    }

    public ResponseEntity<ErrorDetails> toValidationResponse(
            Map<String, String> fieldErrors,
            ServerWebExchange exchange
    ) {
        String path = exchange.getRequest().getPath().value();
        return build(HttpStatus.BAD_REQUEST, "Validation failed", path, fieldErrors);
    }

    private ResponseEntity<ErrorDetails> build(
            HttpStatus status,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        ErrorDetails body = ErrorDetails.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .validationErrors(validationErrors == null || validationErrors.isEmpty() ? null : validationErrors)
                .build();

        return ResponseEntity.status(status).body(body);
    }

    private String safeMessage(Throwable ex) {
        // Avoid nulls surprises in response
        return (ex.getMessage() == null || ex.getMessage().isBlank()) ? ex.getClass().getSimpleName() : ex.getMessage();
    }
}
