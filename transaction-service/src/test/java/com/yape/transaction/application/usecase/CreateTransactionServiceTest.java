package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CreateTransactionService - Application Use Case")
class CreateTransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionEventPublisher eventPublisher;

    @InjectMocks
    private CreateTransactionService createTransactionService;

    private CreateTransactionUseCase.Command validCommand;

    @BeforeEach
    void setUp() {
        validCommand = new CreateTransactionUseCase.Command(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                BigDecimal.valueOf(120)
        );
    }

    @Test
    @DisplayName("Should create transaction with PENDING status and publish event")
    void shouldCreateTransactionWithPendingStatusAndPublishEvent() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = createTransactionService.execute(validCommand);

        assertThat(result).isNotNull();
        assertThat(result.getTransactionStatus()).isEqualTo(TransactionStatus.PENDING);
        assertThat(result.getValue()).isEqualByComparingTo(BigDecimal.valueOf(120));

        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(eventPublisher, times(1)).publishTransactionCreated(any(Transaction.class));
    }

    @Test
    @DisplayName("Should throw exception when value is zero")
    void shouldThrowExceptionWhenValueIsZero() {
        assertThatThrownBy(() ->
                new CreateTransactionUseCase.Command(UUID.randomUUID(), UUID.randomUUID(), 1, BigDecimal.ZERO)
        ).isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(transactionRepository, eventPublisher);
    }

    @Test
    @DisplayName("Should throw exception when accountIds are null")
    void shouldThrowExceptionWhenAccountIdsAreNull() {
        assertThatThrownBy(() ->
                new CreateTransactionUseCase.Command(null, null, 1, BigDecimal.valueOf(100))
        ).isInstanceOf(IllegalArgumentException.class);
    }
}
