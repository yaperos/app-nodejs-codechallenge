package yape.challenge.transaction_service.adapters.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateTransactionRequest {

    @NotBlank
    private String accountExternalIdDebit;

    @NotBlank
    private String accountExternalIdCredit;

    @NotNull
    private Integer tranferTypeId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal value;

    public String getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public void setAccountExternalIdDebit(String v) { this.accountExternalIdDebit = v; }
    public String getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public void setAccountExternalIdCredit(String v) { this.accountExternalIdCredit = v; }
    public Integer getTranferTypeId() { return tranferTypeId; }
    public void setTranferTypeId(Integer v) { this.tranferTypeId = v; }
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal v) { this.value = v; }
}