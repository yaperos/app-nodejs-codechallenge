package com.yape.challenge.adapter.in.web;

import com.yape.challenge.domain.port.in.TransactionUseCase;
import com.yape.challenge.model.TransactionDetailResponse;
import com.yape.challenge.model.TransactionRequest;
import com.yape.challenge.model.TransactionResponse;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;


@Slf4j
@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionUseCase transactionUseCase;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<TransactionResponse> createTransaction(@RequestBody TransactionRequest transactionRequest) {
        return transactionUseCase.createTransaction(transactionRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Flux<TransactionDetailResponse> getTransaction(
            @RequestParam("transactionId") @NotNull UUID transactionId) {

        log.info("Getting transaction detail, transactionId={}", transactionId);
        return transactionUseCase.getTransaction(transactionId);
    }
}
