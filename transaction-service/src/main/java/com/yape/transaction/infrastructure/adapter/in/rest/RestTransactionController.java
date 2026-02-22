package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionCommand;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class RestTransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    public RestTransactionController(CreateTransactionUseCase createTransactionUseCase,
                                     GetTransactionUseCase getTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
    }

    @PostMapping
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request
    ) {
        var command = new CreateTransactionCommand(
                request.accountExternalIdDebit(),
                request.accountExternalIdCredit(),
                request.transferTypeId(),
                request.value()
        );

        Transaction transaction = createTransactionUseCase.execute(command);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(transaction.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(TransactionResponseDto.from(transaction));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponseDto> getTransaction(@PathVariable UUID transactionId) {
        Transaction transaction = getTransactionUseCase.execute(transactionId);
        return ResponseEntity.ok(TransactionResponseDto.from(transaction));
    }
}
