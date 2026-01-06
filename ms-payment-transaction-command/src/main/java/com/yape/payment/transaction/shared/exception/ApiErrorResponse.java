package com.yape.payment.transaction.shared.exception;

import java.time.OffsetDateTime;

public class ApiErrorResponse {

    private String code;
    private String message;
    private OffsetDateTime timestamp;

    public ApiErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = OffsetDateTime.now();
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }
}
