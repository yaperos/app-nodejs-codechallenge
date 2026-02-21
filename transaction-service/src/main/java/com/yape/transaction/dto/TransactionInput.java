package com.yape.transaction.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionInput {
    @NotBlank
    private String accountExternalIdDebit;
    @NotBlank
    private String accountExternalIdCredit;
    private Integer transferTypeId;
    @NotNull
    @DecimalMin("0.01")
    private Float value;
}
