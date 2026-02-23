package com.kafka.productor.infrastructure.controller.dto;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.kafka.productor.application.usecase.command.CreateTransactionCommand;

class CreateTransactionRequestTest {

    @Test
    void shouldMapToCommandCorrectly() {
        UUID debitId = UUID.randomUUID();
        UUID creditId = UUID.randomUUID();
        Long transferType = 1L;
        double value = 1500.0;

        CreateTransactionRequest request = new CreateTransactionRequest(
                debitId,
                creditId,
                transferType,
                value
        );

        CreateTransactionCommand command = request.toCommand();

        assertNotNull(command);
        assertEquals(debitId, command.accountExternalIdDebit());
        assertEquals(creditId, command.accountExternalIdCredit());
        assertEquals(transferType, command.transferTypeId());
        assertEquals(value, command.value());
    }

    @Test
    void shouldAllowNullsAndInvalidsButValidationFailsAtRuntime() {
        CreateTransactionRequest request = new CreateTransactionRequest(
                null,
                null,
                null,
                0
        );

        CreateTransactionCommand command = request.toCommand();

        assertNotNull(command);
        assertNull(command.accountExternalIdDebit());
        assertNull(command.accountExternalIdCredit());
        assertNull(command.transferTypeId());
        assertEquals(0, command.value());
    }
}