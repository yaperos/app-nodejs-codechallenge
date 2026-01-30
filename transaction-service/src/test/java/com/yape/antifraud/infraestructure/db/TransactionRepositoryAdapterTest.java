package com.yape.antifraud.infraestructure.db;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.infrastructure.db.JpaRepository;
import com.yape.transaction.infrastructure.db.TransactionRepositoryAdapter;
import com.yape.transaction.infrastructure.db.entity.TransactionEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionRepositoryAdapterTest {

  @Mock
  private JpaRepository jpaRepository;

  private TransactionRepositoryAdapter adapter;

  private UUID id;
  private Transaction transaction;
  private TransactionEntity entity;

  @BeforeEach
  void setup() {
    adapter = new TransactionRepositoryAdapter(jpaRepository);

    id = UUID.randomUUID();
    Instant now = Instant.now();

    transaction = new Transaction(
      id,
      100.0,
      TransactionStatus.PENDING,
      now
    );

    entity = TransactionEntity.from(transaction);
  }

  @Test
  void shouldSaveTransaction() {
    adapter.save(transaction);

    verify(jpaRepository).save(any(TransactionEntity.class));
  }

  @Test
  void shouldFindTransactionById() {
    when(jpaRepository.findById(id)).thenReturn(Optional.of(entity));

    Optional<Transaction> result = adapter.findById(id);

    assertThat(result).isPresent();
    assertThat(result.get().getId()).isEqualTo(id);
    assertThat(result.get().getStatus()).isEqualTo(TransactionStatus.PENDING);
  }

  @Test
  void shouldTransactionNotFound() {
    when(jpaRepository.findById(id)).thenReturn(Optional.empty());

    Optional<Transaction> result = adapter.findById(id);

    assertThat(result).isEmpty();
  }

  @Test
  void shouldFindAllTransactions() {
    when(jpaRepository.findAll()).thenReturn(List.of(entity));

    List<Transaction> result = adapter.findAll();

    assertThat(result).hasSize(1);
  }

  @Test
  void shouldNoTransactionsExist() {
    when(jpaRepository.findAll()).thenReturn(List.of());

    List<Transaction> result = adapter.findAll();

    assertThat(result).isEmpty();
  }
}
