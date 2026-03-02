package com.codeh.transaction_service.dto.response;

import java.time.LocalDateTime;

public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path
) {}