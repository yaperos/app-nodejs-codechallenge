package com.yape.transaction.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TransferType Enum Tests")
class TransferTypeTest {

    @ParameterizedTest
    @CsvSource({
        "1, TRANSFER, Transfer",
        "2, PAYMENT, Payment",
        "3, DEPOSIT, Deposit",
        "4, WITHDRAWAL, Withdrawal"
    })
    @DisplayName("Should have correct id and name for each type")
    void shouldHaveCorrectIdAndNameForEachType(int id, TransferType type, String name) {
        assertEquals(id, type.getId());
        assertEquals(name, type.getName());
    }

    @ParameterizedTest
    @CsvSource({
        "1, TRANSFER",
        "2, PAYMENT",
        "3, DEPOSIT",
        "4, WITHDRAWAL"
    })
    @DisplayName("Should get type from id")
    void shouldGetTypeFromId(int id, TransferType expected) {
        assertEquals(expected, TransferType.fromId(id));
    }

    @Test
    @DisplayName("Should throw exception for unknown id")
    void shouldThrowExceptionForUnknownId() {
        assertThrows(IllegalArgumentException.class, () -> TransferType.fromId(999));
    }

    @Test
    @DisplayName("Should get name by id")
    void shouldGetNameById() {
        assertEquals("Transfer", TransferType.getNameById(1));
        assertEquals("Payment", TransferType.getNameById(2));
    }
}
