package com.yape.transaction.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public class CreateTransactionRequest {

    @NotNull(message = "accountExternalIdDebit is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "accountExternalIdCredit is required")
    private UUID accountExternalIdCredit;

    @NotNull(message = "tranferTypeId is required")
    private Integer tranferTypeId;

    @NotNull(message = "value is required")
    @Positive(message = "value must be positive")
    private BigDecimal value;

    public CreateTransactionRequest() {
    }

    public UUID getAccountExternalIdDebit() {
        return accountExternalIdDebit;
    }

    public void setAccountExternalIdDebit(UUID accountExternalIdDebit) {
        this.accountExternalIdDebit = accountExternalIdDebit;
    }

    public UUID getAccountExternalIdCredit() {
        return accountExternalIdCredit;
    }

    public void setAccountExternalIdCredit(UUID accountExternalIdCredit) {
        this.accountExternalIdCredit = accountExternalIdCredit;
    }

    public Integer getTranferTypeId() {
        return tranferTypeId;
    }

    public void setTranferTypeId(Integer tranferTypeId) {
        this.tranferTypeId = tranferTypeId;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}
