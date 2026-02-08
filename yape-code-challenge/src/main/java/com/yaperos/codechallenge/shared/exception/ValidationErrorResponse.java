package com.yaperos.codechallenge.shared.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ValidationErrorResponse(
        int status,
        String error,
        List<FieldError> fieldErrors,
        LocalDateTime timestamp
) {

    public ValidationErrorResponse(int status, String error, List<FieldError> fieldErrors) {
        this(status, error, fieldErrors, LocalDateTime.now());
    }

    public record FieldError(String field, String message) {
    }

}
