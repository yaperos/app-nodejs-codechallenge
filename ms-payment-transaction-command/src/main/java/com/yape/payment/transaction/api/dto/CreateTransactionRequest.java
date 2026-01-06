package com.yape.payment.transaction.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class CreateTransactionRequest {

    @NotNull
    private UUID accountExternalIdDebit;

    @NotNull
    private UUID accountExternalIdCredit;

    @NotNull
    private Integer tranferTypeId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal value;

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
