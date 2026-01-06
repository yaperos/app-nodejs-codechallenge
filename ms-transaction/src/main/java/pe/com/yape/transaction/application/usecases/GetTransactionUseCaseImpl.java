package pe.com.yape.transaction.application.usecases;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pe.com.yape.transaction.domain.exceptions.TransactionNotFoundException;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.port.in.GetTransactionUseCase;
import pe.com.yape.transaction.domain.port.out.TransactionRepositoryPort;

@Service
public class GetTransactionUseCaseImpl implements GetTransactionUseCase {

    private static final Logger logger = LoggerFactory.getLogger(GetTransactionUseCaseImpl.class);

    private final TransactionRepositoryPort transactionRepository;

    public GetTransactionUseCaseImpl(TransactionRepositoryPort transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Transaction getById(TransactionId transactionId) {
        logger.info("Retrieving transaction with ID: {}", transactionId);

        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> {
                    logger.error("Transaction not found with ID: {}", transactionId);
                    return new TransactionNotFoundException(
                            "Transaction not found with ID: " + transactionId
                    );
                });
    }
}
