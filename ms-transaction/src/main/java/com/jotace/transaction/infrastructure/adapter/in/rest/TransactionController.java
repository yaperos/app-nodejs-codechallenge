package com.jotace.transaction.infrastructure.adapter.in.rest;

import com.jotace.transaction.application.port.in.TransactionCreationUseCase;
import com.jotace.transaction.application.port.in.TransactionRetrievalUseCase;
import com.jotace.transaction.domain.model.Transaction;
import com.jotace.transaction.infrastructure.adapter.in.rest.dto.TransactionRequest;
import com.jotace.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionCreationUseCase transactionCreationUseCase;
    private final TransactionRetrievalUseCase transactionRetrievalUseCase;

    // Inject the necessary Use Case(s)
    public TransactionController(TransactionCreationUseCase transactionCreationUseCase,
                                 TransactionRetrievalUseCase transactionRetrievalUseCase) {
        this.transactionCreationUseCase = transactionCreationUseCase;
        this.transactionRetrievalUseCase = transactionRetrievalUseCase;
    }

    // POST /transaction (Creation Adapter) - Single Responsibility: HTTP to UseCase mapping
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest request) {
        try {
            Transaction transaction = transactionCreationUseCase.createTransaction(
                    request.accountExternalIdDebit(),
                    request.accountExternalIdCredit(),
                    request.tranferTypeId(), // Corrected field access
                    request.value()
            );

            TransactionResponse response = TransactionResponse.fromDomain(transaction);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            // Generic error handling (e.g., database or Kafka failure)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /transaction/{id} (Retrieval Adapter)
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable("id") UUID id) {
        Transaction transaction = transactionRetrievalUseCase.getTransactionById(id);
        TransactionResponse response = TransactionResponse.fromDomain(transaction);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}