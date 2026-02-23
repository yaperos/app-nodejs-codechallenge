package com.kafka.productor.infrastructure.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.model.TransactionStatus;
import com.kafka.productor.domain.model.TransactionType;
import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;

import lombok.extern.slf4j.Slf4j;

@Slf4j
class TransactionMapperImplTest {

    private final TransactionMapperImpl mapper = new TransactionMapperImpl();

    @Test
    void shouldReturnNullWhenTransactionIsNull() {
        assertNull(mapper.toEntity(null));
    }

    @Test
    void shouldMapTransactionWithAllFields() {

        UUID id = UUID.randomUUID();
        UUID debit = UUID.randomUUID();
        UUID credit = UUID.randomUUID();
        double value = 10.0;
        LocalDateTime createdAt = LocalDateTime.now();

        TransactionType type = new TransactionType(1L, "TRANSFER");

        Transaction transaction = new Transaction(
                id,
                debit,
                credit,
                type,
                value);

        transaction.setStatus(TransactionStatus.APPROVED);
        transaction.setCreatedAt(createdAt);

        TransactionEntity entity = mapper.toEntity(transaction);

        assertNotNull(entity);
        assertEquals(id, entity.getTransactionExternalId());
        assertEquals(debit, entity.getAccountExternalIdDebit());
        assertEquals(credit, entity.getAccountExternalIdCredit());
        assertEquals(1L, entity.getTransactionTypeId());
        assertEquals("TRANSFER", entity.getTransactionTypeName());
        assertEquals("APPROVED", entity.getStatus());
        assertEquals(value, entity.getValue());
        assertEquals(createdAt, entity.getCreatedAt());
    }

    @Test
    void shouldMapTransactionWhenTransactionTypeIsNull() {

        Transaction transaction = new Transaction(
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID(),
                null,
                10.0);

        transaction.setStatus(TransactionStatus.REJECTED);

        TransactionEntity entity = mapper.toEntity(transaction);

        assertNull(entity.getTransactionTypeId());
        assertNull(entity.getTransactionTypeName());
        assertEquals("REJECTED", entity.getStatus());
    }

    @Test
    void shouldMapTransactionWhenStatusIsNull() {

        TransactionType type = new TransactionType(1L, "TRANSFER");

        Transaction transaction = new Transaction(
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID(),
                type,
                1001.0);

        transaction.setStatus(null);

        TransactionEntity entity = mapper.toEntity(transaction);

        assertEquals(1L, entity.getTransactionTypeId());
        assertEquals("TRANSFER", entity.getTransactionTypeName());
        assertNull(entity.getStatus());
    }

    @Test
    void shouldReturnNullWhenEntityIsNull() {
        assertNull(mapper.toDomain(null));
    }

    @Test
    void shouldMapEntityWithAllFields() {

        UUID id = UUID.randomUUID();
        UUID debit = UUID.randomUUID();
        UUID credit = UUID.randomUUID();
        double value = 10.0;

        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(id);
        entity.setAccountExternalIdDebit(debit);
        entity.setAccountExternalIdCredit(credit);
        entity.setTransactionTypeId(1L);
        entity.setTransactionTypeName("TRANSFER");
        entity.setStatus("REJECTED");
        entity.setValue(value);

        Transaction transaction = mapper.toDomain(entity);

        assertNotNull(transaction);
        assertEquals(id, transaction.getTransactionExternalId());
        assertEquals(debit, transaction.getAccountExternalIdDebit());
        assertEquals(credit, transaction.getAccountExternalIdCredit());
        assertEquals("TRANSFER", transaction.getTransactionType().getName());
        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
        assertEquals(value, transaction.getValue());
    }

    @Test
    void shouldMapEntityWhenStatusIsNull() {

        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(UUID.randomUUID());
        entity.setAccountExternalIdDebit(UUID.randomUUID());
        entity.setAccountExternalIdCredit(UUID.randomUUID());
        entity.setTransactionTypeId(1L);
        entity.setTransactionTypeName("TRANSFER");
        entity.setStatus("APPROVED");
        entity.setValue(1001.0);

        Transaction transaction = mapper.toDomain(entity);

        assertNotNull(transaction);
        
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
    }
}