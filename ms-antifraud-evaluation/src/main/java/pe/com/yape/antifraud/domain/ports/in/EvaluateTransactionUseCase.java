package pe.com.yape.antifraud.domain.ports.in;

import pe.com.yape.antifraud.domain.model.TransactionEvaluation;

public interface EvaluateTransactionUseCase {

    void evaluate(TransactionEvaluation transactionEvaluation);
}
