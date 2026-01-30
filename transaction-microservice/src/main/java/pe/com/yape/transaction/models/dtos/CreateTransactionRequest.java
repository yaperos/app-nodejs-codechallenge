package pe.com.yape.transaction.models.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Data
public class CreateTransactionRequest {

    @NotNull(message = "Debit account external id is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "Credit account external id is required")
    private UUID accountExternalIdCredit;

    @NotNull(message = "Transfer type id is required")
    private Integer transferTypeId;

    @NotNull(message = "Transaction value is required")
    @Positive(message = "Transaction value must be greater than zero")
    private BigDecimal value;

}