package com.yape.transactionservice.application.usecases.createtransaction;

import com.yape.transactionservice.application.abstractions.CreateTransactionUseCase;
import com.yape.transactionservice.domain.events.TransactionCreatedEvent;
import com.yape.transactionservice.domain.models.Transaction;
import com.yape.transactionservice.domain.repostories.TransactionRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class CreateTransactionHandler implements CreateTransactionUseCase {
    private final CreateTransactionMapper mapper;
    private final TransactionRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    public CreateTransactionHandler(CreateTransactionMapper mapper,
                                    TransactionRepository repository,
                                    ApplicationEventPublisher eventPublisher
    ) {
        this.mapper = mapper;
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public CreateTransactionResponse execute(CreateTransactionRequest request) {
        Transaction transaction = Transaction.Create(
                request.accountExternalIdDebit(),
                request.accountExternalIdCredit(),
                request.transferTypeId(),
                request.value()
        );

        var saved = repository.save(transaction);

        eventPublisher.publishEvent(new TransactionCreatedEvent(saved));
        return mapper.ToDto(saved);
    }
}
