package com.yape.transactionservice.application.usecases.gettransaction;

import com.yape.transactionservice.application.abstractions.GetTransactionUseCase;
import com.yape.transactionservice.domain.repostories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetTransactionHandler implements GetTransactionUseCase {
    private final GetTransactionMapper mapper;
    private final TransactionRepository repository;

    public GetTransactionHandler(GetTransactionMapper mapper, TransactionRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    @Override
    public List<GetTransactionResponse> execute(GetTransactionRequest request) {
        var transactions = repository.getAll();
        return mapper.ToDTOs(transactions);
    }
}
