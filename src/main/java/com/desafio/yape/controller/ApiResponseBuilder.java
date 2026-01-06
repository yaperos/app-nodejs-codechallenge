package com.desafio.yape.controller;

import com.desafio.yape.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ApiResponseBuilder {

    public ResponseEntity<ErrorResponse> transactionNotFound(String externalId) {
        ErrorResponse err = new ErrorResponse(
                String.format("No se encontró transacción con externalId '%s'", externalId),
                externalId
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
}
