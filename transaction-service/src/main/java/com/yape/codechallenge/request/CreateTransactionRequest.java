package com.yape.codechallenge.request;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateTransactionRequest {
    public UUID accountExternalIdDebit;
    public UUID accountExternalIdCredit;
    public Integer transferTypeId;
    public BigDecimal value;
}
