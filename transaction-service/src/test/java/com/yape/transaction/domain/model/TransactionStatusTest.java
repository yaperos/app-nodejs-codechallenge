package com.yape.transaction.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TransactionStatus Enum Tests")
class TransactionStatusTest {

    @Test
    @DisplayName("Should have correct names for statuses")
    void shouldHaveCorrectNamesForStatuses() {
        assertEquals("pending", TransactionStatus.PENDING.getName());
        assertEquals("approved", TransactionStatus.APPROVED.getName());
        assertEquals("rejected", TransactionStatus.REJECTED.getName());
    }

    @ParameterizedTest
    @CsvSource({
        "pending, PENDING",
        "PENDING, PENDING",
        "approved, APPROVED",
        "APPROVED, APPROVED",
        "rejected, REJECTED",
        "REJECTED, REJECTED"
    })
    @DisplayName("Should parse status from string")
    void shouldParseStatusFromString(String input, TransactionStatus expected) {
        assertEquals(expected, TransactionStatus.fromString(input));
    }

    @Test
    @DisplayName("Should throw exception for unknown status")
    void shouldThrowExceptionForUnknownStatus() {
        assertThrows(IllegalArgumentException.class, () -> TransactionStatus.fromString("unknown"));
    }
}
