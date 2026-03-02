package com.yape.transactionservice.controller;

import com.yape.transactionservice.dto.request.CreateTransactionRequest;
import com.yape.transactionservice.dto.response.TransactionResponse;
import com.yape.transactionservice.dto.response.ValidateAntiFraudTransactionResponse;
import com.yape.transactionservice.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Operaciones realizadas en la tabla Transacciones")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una transacción por ID")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable BigInteger id){
        TransactionResponse response = transactionService.getTransaction(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Crear una transacción")
    public ResponseEntity<TransactionResponse> saveTransaction(@RequestBody CreateTransactionRequest request){
        TransactionResponse response = transactionService.saveTransaction(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate/{id}")
    @Operation(summary = "Validate si una transacción es Fraudulenta")
    public ResponseEntity<ValidateAntiFraudTransactionResponse> validateAntiFraudTransaction(@PathVariable BigInteger id){
        ValidateAntiFraudTransactionResponse response = transactionService.validateTransaction(id);
        return ResponseEntity.ok(response);
    }

}
