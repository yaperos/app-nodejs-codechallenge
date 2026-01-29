package com.jaragon.solution.model;

import java.util.UUID;

public class CreateTransactionRequestDTO {

  private UUID accountExternalIdDebit;
  private UUID accountExternalIdCredit;
  private Integer tranferTypeId;
  private Double value;

  public CreateTransactionRequestDTO(){

  }

  public CreateTransactionRequestDTO(UUID accountExternalIdDebit, UUID accountExternalIdCredit, Integer tranferTypeId, Double value) {
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.tranferTypeId = tranferTypeId;
    this.value = value;
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

  public Double getValue() {
    return value;
  }

  public void setValue(Double value) {
    this.value = value;
  }
}
