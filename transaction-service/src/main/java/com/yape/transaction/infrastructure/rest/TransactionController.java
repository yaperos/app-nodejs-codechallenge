package com.yape.transaction.infrastructure.rest;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import com.yape.transaction.infrastructure.rest.dto.CreateTransactionRequest;
import com.yape.transaction.infrastructure.rest.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody CreateTransactionRequest request) {
        log.info("Received create transaction request for debit account: {}", request.getAccountExternalIdDebit());

        Transaction transaction = toDomain(request);
        Transaction created = createTransactionUseCase.create(transaction);

        TransactionResponse response = toResponse(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable("id") UUID externalId) {
        log.info("Received get transaction request for externalId: {}", externalId);

        Transaction transaction = getTransactionUseCase.getByExternalId(externalId);

        TransactionResponse response = toResponse(transaction);
        return ResponseEntity.ok(response);
    }

    private Transaction toDomain(CreateTransactionRequest request) {
        return Transaction.builder()
                .accountDebit(request.getAccountExternalIdDebit())
                .accountCredit(request.getAccountExternalIdCredit())
                .transferTypeId(request.getTranferTypeId())
                .value(request.getValue())
                .build();
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getExternalId())
                .transactionType(TransactionResponse.TransactionTypeResponse.builder()
                        .name(resolveTransferTypeName(transaction.getTransferTypeId()))
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusResponse.builder()
                        .name(transaction.getStatus().name())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }

    private String resolveTransferTypeName(int transferTypeId) {
        return switch (transferTypeId) {
            case 1 -> "TRANSFER";
            default -> "UNKNOWN";
        };
    }
}
