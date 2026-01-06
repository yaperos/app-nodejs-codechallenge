package pe.com.yape.antifraud.application.usecases;

import org.springframework.stereotype.Component;
import pe.com.yape.antifraud.domain.model.TransactionEvaluation;
import pe.com.yape.antifraud.domain.model.TransactionStatus;
import pe.com.yape.antifraud.domain.ports.in.EvaluateTransactionUseCase;
import pe.com.yape.antifraud.domain.ports.out.PublishTransactionResultPort;

import java.math.BigDecimal;

@Component
public class EvaluateTransactionUseCaseImpl implements EvaluateTransactionUseCase {

    private final PublishTransactionResultPort publisher;

    public EvaluateTransactionUseCaseImpl(PublishTransactionResultPort publisher) {
        this.publisher = publisher;
    }


    @Override
    public void evaluate(TransactionEvaluation transactionEvaluation) {

        int res = transactionEvaluation.amount().compareTo(BigDecimal.valueOf(1000.00));
        TransactionStatus status;
        if (res == 1) {
            status = TransactionStatus.REJECTED;
        } else {
            status = TransactionStatus.APPROVED;
        }

        publisher.publishResult(transactionEvaluation.transactionExternalId(), status);

    }
}
