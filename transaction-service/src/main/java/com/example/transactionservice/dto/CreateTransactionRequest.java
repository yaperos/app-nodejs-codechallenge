package com.example.transactionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotBlank(message = "Account External Id Debit is required")
    private String accountExternalIdDebit;
    @NotBlank(message = "Account External Id Credit is required")
    private String accountExternalIdCredit;
    @NotNull(message = "transfer Type Id is required")
    private Integer transferTypeId;
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal value;
}
