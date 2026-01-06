package pe.com.yape.transaction.application.usecases;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.yape.transaction.domain.exceptions.TransactionNotFoundException;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import pe.com.yape.transaction.domain.port.out.TransactionRepositoryPort;

@Service
public class UpdateTransactionStatusUseCaseImpl implements UpdateTransactionStatusUseCase {

    private static final Logger logger = LoggerFactory.getLogger(UpdateTransactionStatusUseCaseImpl.class);

    private final TransactionRepositoryPort transactionRepository;

    public UpdateTransactionStatusUseCaseImpl(TransactionRepositoryPort transactionRepository) {
        this.transactionRepository = transactionRepository;
    }


    @Override
    @Transactional
    public void approve(TransactionId transactionId) {
        logger.info("Approving transaction with ID: {}", transactionId);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(
                        "Transaction not found with ID: " + transactionId
                ));

        transaction.approve();

        transactionRepository.update(transaction);
        logger.info("Transaction approved successfully: {}", transactionId);

    }

    @Override
    public void reject(TransactionId transactionId) {

        logger.info("Rejecting transaction with ID: {}", transactionId.getValue());

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(
                        "Transaction not found with ID: " + transactionId
                ));

        transaction.reject();

        transactionRepository.update(transaction);
        logger.info("Transaction rejected successfully: {}", transactionId);
    }
}
