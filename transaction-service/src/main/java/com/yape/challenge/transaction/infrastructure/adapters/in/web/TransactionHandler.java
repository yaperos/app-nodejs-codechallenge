package com.yape.challenge.transaction.infrastructure.adapters.in.web;

import com.yape.challenge.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.challenge.transaction.application.usecase.GetTransactionUseCase;
import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.infrastructure.adapters.in.web.dto.CreateTransactionRequest;
import com.yape.challenge.transaction.infrastructure.adapters.in.web.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransactionHandler {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    public Mono<ServerResponse> createTransaction(ServerRequest request) {
        return request.bodyToMono(CreateTransactionRequest.class)
                .map(req -> Transaction.builder()
                        .accountExternalIdDebit(req.getAccountExternalIdDebit())
                        .accountExternalIdCredit(req.getAccountExternalIdCredit())
                        .tranferTypeId(req.getTranferTypeId())
                        .value(req.getValue())
                        .build())
                .flatMap(createTransactionUseCase::execute)
                .map(TransactionResponse::fromDomain)
                .flatMap(response -> ServerResponse.ok().bodyValue(response))
                .onErrorResume(e -> ServerResponse.badRequest().bodyValue(e.getMessage()));
    }

    public Mono<ServerResponse> getTransaction(ServerRequest request) {
        String idStr = request.pathVariable("id");
        UUID id;
        try {
            id = UUID.fromString(idStr);
        } catch (IllegalArgumentException e) {
            return ServerResponse.badRequest().bodyValue("Invalid UUID format");
        }

        return getTransactionUseCase.execute(id)
                .map(TransactionResponse::fromDomain)
                .flatMap(response -> ServerResponse.ok().bodyValue(response))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
}
