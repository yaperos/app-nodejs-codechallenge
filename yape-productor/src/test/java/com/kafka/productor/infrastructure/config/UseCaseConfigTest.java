package com.kafka.productor.infrastructure.config;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;

import com.kafka.productor.application.usecase.service.create.CreateTransactionService;
import com.kafka.productor.application.usecase.service.create.CreateTransactionUseCase;
import com.kafka.productor.domain.port.EventPublisherPort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

class UseCaseConfigTest {

    private final UseCaseConfig useCaseConfig = new UseCaseConfig();

    @Test
    void shouldCreateCreateTransactionUseCaseBean() {

        TransactionRepositoryPort repository =
                mock(TransactionRepositoryPort.class);

        EventPublisherPort eventPublisher =
                mock(EventPublisherPort.class);

        CreateTransactionUseCase useCase =
                useCaseConfig.createTransactionUseCase(repository, eventPublisher);

        assertNotNull(useCase);
        assertTrue(useCase instanceof CreateTransactionService);
    }
}