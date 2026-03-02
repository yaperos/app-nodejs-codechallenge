package com.yape.transaction_service.controller;


import com.yape.transaction_service.business.TransactionBusiness;
import com.yape.transaction_service.dto.TransactionRequestDto;
import com.yape.transaction_service.dto.TransactionResponseDto;
import com.yape.transaction_service.dto.TransactionUpdateDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionBusiness transactionBusiness;
    /**
     * Creacion de transaccion (Command)
     */
    @PostMapping
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @Valid @RequestBody TransactionRequestDto request) {
        TransactionResponseDto response = transactionBusiness.create(request);
        return new ResponseEntity<TransactionResponseDto>(response, HttpStatus.CREATED);
    }

    /**
     * Consulta de detalle o estado (Query)
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDto> getTransactionStatus(
            @PathVariable UUID id) {
        return ResponseEntity.ok(transactionBusiness.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDto> update(@PathVariable UUID id,
                                                         @Valid @RequestBody TransactionUpdateDto requestUpdate) {
        return ResponseEntity.ok(transactionBusiness.updateTransaction(id, requestUpdate));
    }

}
