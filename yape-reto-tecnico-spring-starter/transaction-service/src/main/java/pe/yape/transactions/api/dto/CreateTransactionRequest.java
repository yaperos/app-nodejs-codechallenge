package pe.yape.transactions.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionRequest(
        @NotNull UUID accountExternalIdDebit,
        @NotNull UUID accountExternalIdCredit,
        @NotNull Integer tranferTypeId,
        @NotNull @Positive BigDecimal value
) {}