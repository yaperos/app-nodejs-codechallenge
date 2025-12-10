package com.pe.yape.service.challenge.transactions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequest {

    @NotBlank(message = "Attribute accountExternalIdDebit is required")
    @Pattern(regexp = "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-5][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$" ,
            message = "Attribute accountExternalIdDebit is invalid")
    private String accountExternalIdDebit;

    @NotBlank(message = "Attribute accountExternalIdCredit is required")
    @Pattern(regexp = "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-5][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$" ,
            message = "Attribute accountExternalIdDebit is invalid")
    private String accountExternalIdCredit;

    @NotNull(message = "Attribute transferTypeId is required")
    private Integer transferTypeId;

    @NotNull(message = "Attribute value is required")
    @Positive(message = "Attribute value is invalid")
    private Double value;

}
