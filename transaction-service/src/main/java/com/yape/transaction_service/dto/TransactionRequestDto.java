package com.yape.transaction_service.dto;

import com.yape.transaction_service.model.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDto {

    @NotNull(message = "El ID de cuenta de origen es obligatorio")
    private UUID accountExternalIdDebit;

    @NotNull(message = "El ID de cuenta de destino es obligatorio")
    private UUID accountExternalIdCredit;

    @NotNull(message = "El tipo de transferencia es obligatorio")
    private Integer transferTypeId;

    @NotNull(message = "El monto de la transacción es obligatorio")
    @DecimalMin(value = "0.01", message = "El valor debe ser mayor a cero")
    private BigDecimal value;

}