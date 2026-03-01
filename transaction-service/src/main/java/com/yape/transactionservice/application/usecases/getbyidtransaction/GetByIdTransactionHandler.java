package com.yape.transactionservice.application.usecases.getbyidtransaction;

import com.yape.transactionservice.application.abstractions.GetByIdTransactionUseCase;
import com.yape.transactionservice.domain.exceptions.TransactionNotFoundException;
import com.yape.transactionservice.domain.models.Transaction;
import com.yape.transactionservice.domain.repostories.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class GetByIdTransactionHandler implements GetByIdTransactionUseCase {
    private final GetByIdTransactionMapper mapper;
    private final TransactionRepository repository;

    public GetByIdTransactionHandler(GetByIdTransactionMapper mapper, TransactionRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    @Override
    public GetByIdTransactionResponse execute(GetByIdTransactionRequest request) {
        Transaction transaction = repository.getById(request.id())
                                            .orElseThrow(() -> new TransactionNotFoundException(request.id()));
        return mapper.toDTO(transaction);
    }
}
