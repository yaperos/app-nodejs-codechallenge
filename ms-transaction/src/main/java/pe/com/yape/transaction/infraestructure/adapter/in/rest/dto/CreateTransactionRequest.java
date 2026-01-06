package pe.com.yape.transaction.infraestructure.adapter.in.rest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateTransactionRequest {

    @NotNull(message = "accountExternalIdDebit is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "accountExternalIdCredit is required")
    private UUID accountExternalIdCredit;

    @NotNull(message = "transferTypeId is required")
    @Positive(message = "transferTypeId must be positive")
    private Integer transferTypeId;

    @NotNull(message = "value is required")
    @Positive(message = "value must be positive")
    private Double value;


}
