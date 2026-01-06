package pe.com.yape.antifraud.domain.ports.out;

import pe.com.yape.antifraud.domain.model.TransactionStatus;

import java.util.UUID;

public interface PublishTransactionResultPort {
    void publishResult(UUID transactionExternalId, TransactionStatus transactionStatus);
}
