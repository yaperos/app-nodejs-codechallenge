package com.pe.yape.service.challenge.transactions.controller;

import com.pe.yape.service.challenge.transactions.httpclient.dto.*;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
public class TransactionGatewayController {

    private final WebClient client;

    public TransactionGatewayController(WebClient.Builder builder) {
        this.client = builder.build();
    }

    @GetMapping("/{transactionExternalId}")
    @CircuitBreaker(name = "transactionServices", fallbackMethod = "fallbackTransaction")
    @Retry(name = "transactionRetry")
    @TimeLimiter(name = "transactionTimeout")
    public Mono<SearchTransactionResponse> getById(@PathVariable String transactionExternalId) {
        return client.get()
                .uri("http://localhost:8085/api/transactions-report/transactions/{id}", transactionExternalId)
                .retrieve()
                .bodyToMono(SearchTransactionResponse.class);
    }

    @PostMapping("/")
    @CircuitBreaker(name = "transactionServices", fallbackMethod = "fallbackCreateTransaction")
    @Retry(name = "transactionRetry")
    @TimeLimiter(name = "transactionTimeout")
    public Mono<CreateTransactionResponse> create(@RequestBody CreateTransactionRequest request) {

        return client.post()
                .uri("http://localhost:8080/api/transactions/")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(CreateTransactionResponse.class);
    }


    public Mono<SearchTransactionResponse> fallbackTransaction(String id, Throwable ex) {
        return Mono.just(new SearchTransactionResponse(
                id,
                new TransactionType("UNKNOWN"),
                new TransactionStatus("FAILED"),
                new BigDecimal("0"),
                LocalDateTime.now()
        ));
    }

    public Mono<CreateTransactionResponse> fallbackCreateTransaction(CreateTransactionRequest request,
                                                                     Throwable ex) {
        return Mono.just(new CreateTransactionResponse("none"));
    }
}
