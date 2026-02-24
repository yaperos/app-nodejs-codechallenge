package pe.yape.transactions.api.controller;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.yape.transactions.api.dto.CreateTransactionRequest;
import pe.yape.transactions.api.dto.CreateTransactionResponse;
import pe.yape.transactions.api.dto.TransactionResponse;
import pe.yape.transactions.application.service.TransactionApplicationService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionApplicationService service;

    public TransactionController(TransactionApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CreateTransactionResponse> create(@Valid @RequestBody CreateTransactionRequest request){
        return ResponseEntity.accepted().body(service.create(request));
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> get(@PathVariable UUID transactionExternalId){
        return ResponseEntity.ok(service.get(transactionExternalId));
    }
}