package com.tec.yape.transaction.infrastructure.config.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@Builder
public class ErrorDto {
    private String code;
    private String message;
    private HttpStatus status;
}
