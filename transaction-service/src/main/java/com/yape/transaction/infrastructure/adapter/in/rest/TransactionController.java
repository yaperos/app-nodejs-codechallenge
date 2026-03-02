package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.application.usecase.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    public TransactionController(CreateTransactionUseCase createTransactionUseCase,
                                 GetTransactionUseCase getTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
    }

    @PostMapping
    public ResponseEntity<CreateTransactionResponse> createTransaction(
            @RequestBody CreateTransactionRequest request) {

        Transaction transaction = createTransactionUseCase.execute(
                new CreateTransactionUseCase.Command(
                        request.accountExternalIdDebit(),
                        request.accountExternalIdCredit(),
                        request.tranferTypeId(),
                        request.value()
                )
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateTransactionResponse(transaction.getTransactionExternalId()));
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<GetTransactionResponse> getTransaction(
            @PathVariable UUID transactionExternalId) {

        Transaction transaction = getTransactionUseCase.execute(transactionExternalId);

        return ResponseEntity.ok(GetTransactionResponse.from(transaction));
    }

    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(TransactionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    // ── Request / Response DTOs (inner records - keep them close to the controller) ──

    public record CreateTransactionRequest(
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer tranferTypeId,
            BigDecimal value
    ) {}

    public record CreateTransactionResponse(UUID transactionExternalId) {}

    public record GetTransactionResponse(
            UUID transactionExternalId,
            TransactionTypeDto transactionType,
            TransactionStatusDto transactionStatus,
            BigDecimal value,
            LocalDateTime createdAt
    ) {
        static GetTransactionResponse from(Transaction t) {
            return new GetTransactionResponse(
                    t.getTransactionExternalId(),
                    new TransactionTypeDto(t.getTransactionType().getName()),
                    new TransactionStatusDto(t.getTransactionStatus().name()),
                    t.getValue(),
                    t.getCreatedAt()
            );
        }
    }

    public record TransactionTypeDto(String name) {}
    public record TransactionStatusDto(String name) {}
    public record ErrorResponse(String message) {}
}
