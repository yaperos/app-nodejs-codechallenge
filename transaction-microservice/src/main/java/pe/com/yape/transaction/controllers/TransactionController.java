package pe.com.yape.transaction.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.com.yape.transaction.models.dtos.CreateTransactionRequest;
import pe.com.yape.transaction.models.dtos.TransactionResponse;
import pe.com.yape.transaction.services.TransactionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @Valid @RequestBody CreateTransactionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping("/{externalId}")
    public ResponseEntity<TransactionResponse> get(@PathVariable UUID externalId) {
        return ResponseEntity.ok(service.getByExternalId(externalId));
    }

    @GetMapping()
    public ResponseEntity<List<TransactionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
