package pe.com.yape.transaction.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.yape.transaction.exceptions.BusinessException;
import pe.com.yape.transaction.kafka.producers.TransactionProducer;
import pe.com.yape.transaction.models.dtos.CreateTransactionRequest;
import pe.com.yape.transaction.models.dtos.TransactionResponse;
import pe.com.yape.transaction.models.entities.AccountEntity;
import pe.com.yape.transaction.models.entities.TransactionEntity;
import pe.com.yape.transaction.models.enums.TransactionStatus;
import pe.com.yape.transaction.repositories.AccountRepository;
import pe.com.yape.transaction.repositories.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;
    private final AccountRepository accountRepository;
    private final TransactionProducer producer;
    private final SimpMessagingTemplate messagingTemplate;

    public List<TransactionResponse> getAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::map)
                .toList();
    }
    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {

        if (request.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Transaction value must be greater than zero");
        }

        if (request.getAccountExternalIdDebit()
                .equals(request.getAccountExternalIdCredit())) {
            throw new BusinessException("Debit and credit accounts must be different");
        }

        AccountEntity debitAccount = accountRepository
                .findByAccountExternalId(request.getAccountExternalIdDebit())
                .orElseThrow(() -> new BusinessException("Debit account not found"));

        AccountEntity creditAccount = accountRepository
                .findByAccountExternalId(request.getAccountExternalIdCredit())
                .orElseThrow(() -> new BusinessException("Credit account not found"));

        if (debitAccount.getBalance().compareTo(request.getValue()) < 0) {
            throw new BusinessException("Insufficient balance");
        }

        TransactionEntity entity = TransactionEntity.builder()
                .accountExternalIdDebit(debitAccount.getAccountExternalId())
                .accountExternalIdCredit(creditAccount.getAccountExternalId())
                .transferTypeId(request.getTransferTypeId())
                .value(request.getValue())
                .status(TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(entity);

        try {
            producer.sendTransactionCreated(entity);
        } catch (Exception ex) {
            throw new BusinessException("Error sending transaction to anti-fraud");
        }

        return map(entity);
    }

    @Transactional
    public void updateStatus(UUID transactionExternalId, String status) {

        TransactionStatus newStatus;
        try {
            newStatus = TransactionStatus.valueOf(status);
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Invalid transaction status");
        }

        TransactionEntity transaction = repository
                .findByTransactionExternalId(transactionExternalId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (transaction.getStatus() == newStatus) {
            return;
        }

        if (newStatus == TransactionStatus.APPROVED) {

            AccountEntity debit = accountRepository
                    .findByAccountExternalId(transaction.getAccountExternalIdDebit())
                    .orElseThrow(() -> new BusinessException("Debit account not found"));

            AccountEntity credit = accountRepository
                    .findByAccountExternalId(transaction.getAccountExternalIdCredit())
                    .orElseThrow(() -> new BusinessException("Credit account not found"));

            if (debit.getBalance().compareTo(transaction.getValue()) < 0) {
                throw new BusinessException("Insufficient balance at approval time");
            }

            debit.setBalance(debit.getBalance().subtract(transaction.getValue()));
            credit.setBalance(credit.getBalance().add(transaction.getValue()));
        }

        transaction.setStatus(newStatus);
        messagingTemplate.convertAndSend("/topic/transactions", map(transaction));
    }

    @Transactional(readOnly = true)
    public TransactionResponse getByExternalId(UUID externalId) {

        TransactionEntity entity = repository
                .findByTransactionExternalId(externalId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        return map(entity);
    }

    private TransactionResponse map(TransactionEntity entity) {
        return TransactionResponse.builder()
                .transactionExternalId(entity.getTransactionExternalId())
                .transactionStatus(entity.getStatus().name())
                .value(entity.getValue())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}