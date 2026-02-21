package com.yape.transaction.handler;

import com.yape.transaction.dto.TransactionInput;
import com.yape.transaction.dto.ErrorResponse;
import com.yape.transaction.node.TransactionNode;
import com.yape.transaction.service.TransactionService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionHandler {

    private final TransactionService transactionService;

    public Mono<ServerResponse> createTransaction(ServerRequest request) {
        return request.bodyToMono(TransactionInput.class)
                .doOnNext(this::validate)
                .flatMap(transactionService::createTransaction)
                .flatMap(tx -> ServerResponse
                        .status(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(tx)
                )
                .onErrorResume(ValidationException.class, ex ->
                        ServerResponse.badRequest()
                                .bodyValue(ErrorResponse.of(ex.getMessage()))
                )
                .onErrorResume(ex -> {
                    log.error("Unexpected error creating transaction", ex);
                    return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .bodyValue(ErrorResponse.of("Internal server error"));
                });
    }

    public Mono<ServerResponse> getTransaction(ServerRequest request) {
        String id = request.pathVariable("id");
        return transactionService.findById(id)
                .flatMap(tx -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(tx)
                )
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getAccountTransactions(ServerRequest request) {
        String accountId = request.pathVariable("accountId");
        int limit = request.queryParam("limit")
                .map(Integer::parseInt)
                .orElse(20);

        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(transactionService.getAccountTransactions(accountId, limit),
                        TransactionNode.class);
    }

    private void validate(TransactionInput input) {
        if (input.getAccountExternalIdDebit() == null || input.getAccountExternalIdDebit().isBlank())
            throw new ValidationException("accountExternalIdDebit is required");
        if (input.getAccountExternalIdCredit() == null || input.getAccountExternalIdCredit().isBlank())
            throw new ValidationException("accountExternalIdCredit is required");
        if (input.getValue() == null || input.getValue().compareTo(0.0F) <= 0)
            throw new ValidationException("amount must be greater than 0");
    }
}
