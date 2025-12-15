package com.transaction.app.infrastructure.controller.dto;

import com.transaction.app.domain.model.TransactionModel;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTransactionRequest {

    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;

    public TransactionModel toModel() {
        TransactionModel model = new TransactionModel();
        model.setAccountExternalIdDebit(accountExternalIdDebit);
        model.setAccountExternalIdCredit(accountExternalIdCredit);
        model.setTranferTypeId(tranferTypeId);
        model.setValue(value);
        return model;
    }
}
