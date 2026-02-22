package com.yape.transaction.domain.port.in;

public interface UpdateTransactionStatusUseCase {

    void execute(UpdateTransactionStatusCommand command);
}
