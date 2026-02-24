package pe.yape.antifraud.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record AntifraudValidateRequest(
        @NotNull UUID transactionExternalId,
        @NotNull UUID accountExternalIdDebit,
        @NotNull UUID accountExternalIdCredit,
        @NotNull Integer tranferTypeId,
        @NotNull @Positive BigDecimal value
) {}