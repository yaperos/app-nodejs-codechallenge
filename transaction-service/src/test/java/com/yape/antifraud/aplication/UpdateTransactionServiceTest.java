package com.yape.antifraud.aplication;

import com.yape.transaction.application.service.UpdateTransactionService;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class UpdateTransactionServiceTest {

  private TransactionRepository repository;
  private UpdateTransactionService service;

  @BeforeEach
  void setup() {
    repository = mock(TransactionRepository.class);
    service = new UpdateTransactionService(repository);
  }

  @Test
  void updateStatus_Transaction() {
    UUID id = UUID.randomUUID();
    Transaction transaction = new Transaction(id, 100.0);

    when(repository.findById(id)).thenReturn(Optional.of(transaction));

    service.updateStatus(id, TransactionStatus.APPROVED);

    assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    verify(repository, times(1)).save(transaction);
  }

  @Test
  void updateStatus_WhenTransactionNotFound() {
    UUID id = UUID.randomUUID();
    when(repository.findById(id)).thenReturn(Optional.empty());

    IllegalStateException ex = assertThrows(
      IllegalStateException.class,
      () -> service.updateStatus(id, TransactionStatus.REJECTED)
    );

    assertThat(ex.getMessage()).isEqualTo("Transaction not found");
    verify(repository, never()).save(any());
  }
}
