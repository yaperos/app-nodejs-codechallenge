package com.kafka.productor.application.usecase.service.update;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.kafka.productor.domain.port.TransactionCachePort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

class UpdateTransactionStatusServiceTest {

    private TransactionRepositoryPort repository;
    private TransactionCachePort cache;
    private UpdateTransactionStatusService service;

    @BeforeEach
    void setup() {
        repository = mock(TransactionRepositoryPort.class);
        cache = mock(TransactionCachePort.class);
        service = new UpdateTransactionStatusService(repository, cache);
    }

    @Test
    void execute_shouldUpdateStatusAndDeleteFromCache() {
        UUID id = UUID.randomUUID();
        String status = "APPROVED";

        service.execute(id, status);

        verify(repository).updateStatus(id, status);

        verify(cache).delete(id);
    }
}