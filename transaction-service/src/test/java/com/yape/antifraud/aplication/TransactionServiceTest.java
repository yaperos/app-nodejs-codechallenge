package com.yape.antifraud.aplication;

import com.yape.transaction.application.port.out.TransactionEventPublisher;
import com.yape.transaction.application.service.TransactionService;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.rest.dto.TransactionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

  private TransactionRepository repository;
  private TransactionEventPublisher publisher;
  private TransactionService service;

  @BeforeEach
  void setup() {
    repository = mock(TransactionRepository.class);
    publisher = mock(TransactionEventPublisher.class);
    service = new TransactionService(repository, publisher);
  }

  @Test
  void create_PublishTransaction() {
    TransactionRequest request = new TransactionRequest();
    request.setAmount(150.0);

    Transaction tx = service.create(request);

    verify(repository, times(1)).save(any(Transaction.class));
    verify(publisher, times(1)).publish(any(Transaction.class));

    assertThat(tx.getAmount()).isEqualTo(150.0);
    assertThat(tx.getId()).isNotNull();
  }

  @Test
  void getById_Transaction_WhenExists() {
    UUID id = UUID.randomUUID();
    Transaction tx = new Transaction(id, 200.0);
    when(repository.findById(id)).thenReturn(Optional.of(tx));

    Transaction result = service.getById(id);

    assertThat(result).isEqualTo(tx);
    verify(repository, times(1)).findById(id);
  }

  @Test
  void getById_Exception_WhenNotFound() {
    UUID id = UUID.randomUUID();
    when(repository.findById(id)).thenReturn(Optional.empty());

    IllegalStateException ex = assertThrows(IllegalStateException.class, () -> service.getById(id));
    assertThat(ex.getMessage()).isEqualTo("Transaction not found");
    verify(repository, times(1)).findById(id);
  }

  @Test
  void getAllTransactions_WhenEmpty() {
    when(repository.findAll()).thenReturn(List.of());

    IllegalStateException ex = assertThrows(IllegalStateException.class, () -> service.getAllTransactions());
    assertThat(ex.getMessage()).isEqualTo("Transactions not found");
    verify(repository, times(1)).findAll();
  }
}
