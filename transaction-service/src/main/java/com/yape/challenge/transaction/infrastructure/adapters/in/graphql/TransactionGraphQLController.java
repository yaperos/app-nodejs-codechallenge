package com.yape.challenge.transaction.infrastructure.adapters.in.graphql;

import com.yape.challenge.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.challenge.transaction.application.usecase.GetTransactionUseCase;
import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.infrastructure.adapters.in.web.dto.CreateTransactionRequest;
import com.yape.challenge.transaction.infrastructure.adapters.in.web.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class TransactionGraphQLController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @QueryMapping
    public Mono<TransactionResponse> getTransaction(@Argument String id) {
        return getTransactionUseCase.execute(UUID.fromString(id))
                .map(TransactionResponse::fromDomain);
    }

    @MutationMapping
    public Mono<TransactionResponse> createTransaction(@Argument("request") CreateTransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .tranferTypeId(request.getTranferTypeId())
                .value(request.getValue())
                .build();
        return createTransactionUseCase.execute(transaction)
                .map(TransactionResponse::fromDomain);
    }
}
