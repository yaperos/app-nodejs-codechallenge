package com.yape.transaction_service.dto;

import com.yape.transaction_service.enums.TransactionStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionUpdateDto {

    @NotNull(message = "El estado es obligatorio. Valores permitidos: PENDING, APPROVED, REJECTED")
    private TransactionStatusEnum status; // valida que el valor sea correcto
}