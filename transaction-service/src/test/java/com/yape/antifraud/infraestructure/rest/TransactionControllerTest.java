package com.yape.antifraud.infraestructure.rest;

import java.util.UUID;
import java.util.List;
import java.util.Arrays;

import com.yape.transaction.infrastructure.rest.TransactionController;
import com.yape.transaction.application.port.in.TransactionUseCase;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.infrastructure.rest.dto.TransactionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

class TransactionControllerTest {

  private TransactionUseCase useCase;
  private TransactionController controller;

  @BeforeEach
  void setup() {
    useCase = mock(TransactionUseCase.class);
    controller = new TransactionController(useCase);
  }

  @Test
  void create_Transaction() {
    TransactionRequest request = new TransactionRequest();
    request.setAmount(100.0);

    Transaction tx = new Transaction(UUID.randomUUID(), 100.0);
    when(useCase.create(request)).thenReturn(tx);

    Transaction result = controller.create(request);

    assertThat(result).isNotNull();
    assertThat(result.getAmount()).isEqualTo(100.0);
    verify(useCase, times(1)).create(request);
  }

  @Test
  void getAll_Transactions() {
    Transaction tx1 = new Transaction(UUID.randomUUID(), 50.0);
    Transaction tx2 = new Transaction(UUID.randomUUID(), 75.0);
    List<Transaction> transactions = Arrays.asList(tx1, tx2);

    when(useCase.getAllTransactions()).thenReturn(transactions);

    List<Transaction> result = controller.getAll();

    assertThat(result).hasSize(2);
    assertThat(result).containsExactly(tx1, tx2);
    verify(useCase, times(1)).getAllTransactions();
  }

  @Test
  void getById_Transaction() {
    UUID id = UUID.randomUUID();
    Transaction tx = new Transaction(id, 200.0);

    when(useCase.getById(id)).thenReturn(tx);

    Transaction result = controller.getById(id);

    assertThat(result.getId()).isEqualTo(id);
    assertThat(result.getAmount()).isEqualTo(200.0);
    verify(useCase, times(1)).getById(id);
  }
}
