package com.yape.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor(staticName = "of")
public class ErrorResponse {
    private String message;
    private Instant timestamp = Instant.now();

    public static ErrorResponse of(String message) {
        return new ErrorResponse(message, Instant.now());
    }
}
