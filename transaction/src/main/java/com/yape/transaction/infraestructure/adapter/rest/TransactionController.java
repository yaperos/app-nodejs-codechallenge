package com.yape.transaction.infraestructure.adapter.rest;

import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import com.yape.transaction.application.dto.GetTransactionResponse;
import com.yape.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.transaction.application.usecase.GetTransactionUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CreateTransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest createTransactionRequest) {
        logger.info("Creating transaction");
        return createTransactionUseCase.execute(createTransactionRequest);
    }

    @GetMapping("/{transactionExternalId}")
    public Mono<GetTransactionResponse> getTransaction(@PathVariable String transactionExternalId) {
        logger.info("Getting transaction with id: {}", transactionExternalId);
        return getTransactionUseCase.execute(transactionExternalId);
    }
}
