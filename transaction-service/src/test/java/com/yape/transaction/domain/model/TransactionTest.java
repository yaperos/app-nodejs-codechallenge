package com.yape.transaction.domain.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TransactionTest {

    @Test
    void shouldCreateTransactionWithPendingStatus() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("500.00")
        );

        assertThat(transaction.getId()).isNotNull();
        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.PENDING);
        assertThat(transaction.getValue()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(transaction.getCreatedAt()).isNotNull();
        assertThat(transaction.isPending()).isTrue();
    }

    @Test
    void shouldApproveTransaction() {
        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        transaction.approve();

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
        assertThat(transaction.isPending()).isFalse();
        assertThat(transaction.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldRejectTransaction() {
        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("2000"));
        transaction.reject();

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.REJECTED);
        assertThat(transaction.isPending()).isFalse();
    }

    @Test
    void shouldNotApproveAlreadyApprovedTransaction() {
        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        transaction.approve();

        assertThatThrownBy(transaction::approve)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot approve");
    }

    @Test
    void shouldNotRejectAlreadyRejectedTransaction() {
        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        transaction.reject();

        assertThatThrownBy(transaction::reject)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot reject");
    }

    @Test
    void shouldResolveTransferTypeName() {
        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        assertThat(transaction.getTransferTypeName()).isEqualTo("transfer");
    }
}
