package com.yape.business.financial.infrastructure.web.request;

import java.math.BigDecimal;

public record CreateTransactionRequest(
    String accountExternalIdDebit,
    String accountExternalIdCredit,
    Integer transferTypeId,
    BigDecimal value
) {}
