package com.challenge.transaction.app.config;

import com.challenge.transaction.core.ports.input.CreateTransactionUseCase;
import com.challenge.transaction.core.ports.input.GetTransactionUseCase;
import com.challenge.transaction.core.ports.output.TransactionEventPublisher;
import com.challenge.transaction.core.ports.output.TransactionRepository;
import com.challenge.transaction.core.usecase.CreateTransactionService;
import com.challenge.transaction.core.usecase.GetTransactionService;
import com.challenge.transaction.core.usecase.UpdateTransactionStatusService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public CreateTransactionUseCase createTransactionUseCase(
            TransactionRepository repository,
            TransactionEventPublisher publisher) {
        return new CreateTransactionService(repository, publisher);
    }

    @Bean
    public GetTransactionUseCase getTransactionUseCase(
            TransactionRepository repository) {
        return new GetTransactionService(repository);
    }

    @Bean
    public UpdateTransactionStatusService updateTransactionStatusService(
            TransactionRepository repository) {
        return new UpdateTransactionStatusService(repository);
    }
}
