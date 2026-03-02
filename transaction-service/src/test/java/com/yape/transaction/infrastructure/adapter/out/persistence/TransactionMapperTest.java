package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Transaction Mapper Tests")
class TransactionMapperTest {

    private TransactionMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new TransactionMapper();
    }

    @Test
    @DisplayName("Should map domain to entity")
    void shouldMapDomainToEntity() {
        // Given
        Transaction domain = new Transaction();
        domain.setTransactionExternalId(UUID.randomUUID());
        domain.setAccountExternalIdDebit(UUID.randomUUID());
        domain.setAccountExternalIdCredit(UUID.randomUUID());
        domain.setTransferTypeId(1);
        domain.setValue(new BigDecimal("500.00"));
        domain.setStatus(TransactionStatus.PENDING);
        domain.setCreatedAt(LocalDateTime.now());
        domain.setUpdatedAt(LocalDateTime.now());

        // When
        TransactionEntity entity = mapper.toEntity(domain);

        // Then
        assertEquals(domain.getTransactionExternalId(), entity.getTransactionExternalId());
        assertEquals(domain.getAccountExternalIdDebit(), entity.getAccountExternalIdDebit());
        assertEquals(domain.getAccountExternalIdCredit(), entity.getAccountExternalIdCredit());
        assertEquals(domain.getTransferTypeId(), entity.getTransferTypeId());
        assertEquals(domain.getValue(), entity.getValue());
        assertEquals("pending", entity.getStatus());
        assertEquals(domain.getCreatedAt(), entity.getCreatedAt());
        assertEquals(domain.getUpdatedAt(), entity.getUpdatedAt());
    }

    @Test
    @DisplayName("Should map entity to domain")
    void shouldMapEntityToDomain() {
        // Given
        TransactionEntity entity = new TransactionEntity();
        entity.setId(1L);
        entity.setTransactionExternalId(UUID.randomUUID());
        entity.setAccountExternalIdDebit(UUID.randomUUID());
        entity.setAccountExternalIdCredit(UUID.randomUUID());
        entity.setTransferTypeId(2);
        entity.setValue(new BigDecimal("1500.00"));
        entity.setStatus("rejected");
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setVersion(1L);

        // When
        Transaction domain = mapper.toDomain(entity);

        // Then
        assertEquals(entity.getTransactionExternalId(), domain.getTransactionExternalId());
        assertEquals(entity.getAccountExternalIdDebit(), domain.getAccountExternalIdDebit());
        assertEquals(entity.getAccountExternalIdCredit(), domain.getAccountExternalIdCredit());
        assertEquals(entity.getTransferTypeId(), domain.getTransferTypeId());
        assertEquals(entity.getValue(), domain.getValue());
        assertEquals(TransactionStatus.REJECTED, domain.getStatus());
        assertEquals(entity.getCreatedAt(), domain.getCreatedAt());
        assertEquals(entity.getUpdatedAt(), domain.getUpdatedAt());
    }

    @Test
    @DisplayName("Should update entity from domain")
    void shouldUpdateEntityFromDomain() {
        // Given
        TransactionEntity entity = new TransactionEntity();
        entity.setStatus("pending");
        entity.setUpdatedAt(LocalDateTime.now().minusHours(1));

        Transaction domain = new Transaction();
        domain.setStatus(TransactionStatus.APPROVED);
        domain.setUpdatedAt(LocalDateTime.now());

        // When
        mapper.updateEntity(entity, domain);

        // Then
        assertEquals("approved", entity.getStatus());
        assertEquals(domain.getUpdatedAt(), entity.getUpdatedAt());
    }
}
