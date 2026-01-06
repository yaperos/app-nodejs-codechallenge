package pe.com.yape.transaction.domain.port.in;

import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.AccountExternalId;
import pe.com.yape.transaction.domain.model.valueObjects.Amount;
import pe.com.yape.transaction.domain.model.valueObjects.TransferTypeId;

public interface CreateTransactionUseCase {

    Transaction create(
            AccountExternalId accountExternalIdDebit,
            AccountExternalId accountExternalIdCredit,
            TransferTypeId transferTypeId,
            Amount value
    );
}
