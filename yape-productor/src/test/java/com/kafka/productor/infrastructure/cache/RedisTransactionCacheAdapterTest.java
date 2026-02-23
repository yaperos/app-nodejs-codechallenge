package com.kafka.productor.infrastructure.cache;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import com.kafka.productor.domain.model.Transaction;

@ExtendWith(MockitoExtension.class)
class RedisTransactionCacheAdapterTest {

    @Mock
    private RedisTemplate<String, Transaction> redisTemplate;

    @Mock
    private ValueOperations<String, Transaction> valueOperations;

    @InjectMocks
    private RedisTransactionCacheAdapter adapter;

    private static final String PREFIX = "transaction:";

    @Test
    void shouldReturnTransactionWhenExistsInCache() {
        UUID id = UUID.randomUUID();
        Transaction transaction = mock(Transaction.class);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(PREFIX + id)).thenReturn(transaction);

        Optional<Transaction> result = adapter.findById(id);

        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());
    }

    @Test
    void shouldReturnEmptyWhenTransactionNotInCache() {
        UUID id = UUID.randomUUID();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(PREFIX + id)).thenReturn(null);

        Optional<Transaction> result = adapter.findById(id);

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldSaveTransactionWithTTL() {
        Transaction transaction = mock(Transaction.class);
        UUID id = UUID.randomUUID();

        when(transaction.getTransactionExternalId()).thenReturn(id);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        adapter.save(transaction);

        verify(valueOperations).set(
                eq(PREFIX + id),
                eq(transaction),
                eq(Duration.ofMinutes(10))
        );
    }

    @Test
    void shouldDeleteTransaction() {
        UUID id = UUID.randomUUID();

        adapter.delete(id);

        verify(redisTemplate).delete(PREFIX + id);
        verifyNoInteractions(valueOperations);
    }
}