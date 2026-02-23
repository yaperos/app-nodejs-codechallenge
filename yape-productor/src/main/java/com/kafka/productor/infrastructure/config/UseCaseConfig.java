package com.kafka.productor.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.kafka.productor.application.usecase.service.create.CreateTransactionService;
import com.kafka.productor.application.usecase.service.create.CreateTransactionUseCase;
import com.kafka.productor.domain.port.EventPublisherPort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

@Configuration
public class UseCaseConfig {

    @Bean
    public CreateTransactionUseCase createTransactionUseCase(
            TransactionRepositoryPort repository,
            EventPublisherPort eventPublisher) {

        return new CreateTransactionService(repository, eventPublisher);
    }
}
