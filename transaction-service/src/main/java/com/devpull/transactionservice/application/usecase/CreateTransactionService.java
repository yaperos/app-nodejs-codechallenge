package com.devpull.transactionservice.application.usecase;

import com.devpull.transactionservice.application.dto.command.CreateTransactionCommand;
import com.devpull.transactionservice.application.dto.result.TransactionResult;
import com.devpull.transactionservice.application.port.in.CreateTransactionUseCase;
import com.devpull.transactionservice.application.port.out.AccountRepositoryPort;
import com.devpull.transactionservice.application.port.out.AntiFraudPort;
import com.devpull.transactionservice.application.port.out.TransactionRepositoryPort;
import com.devpull.transactionservice.domain.enums.TransactionType;
import com.devpull.transactionservice.domain.exception.BadRequestException;
import com.devpull.transactionservice.domain.exception.ResourceNotFoundException;
import com.devpull.transactionservice.domain.model.Transaction;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class CreateTransactionService implements CreateTransactionUseCase {

    private final TransactionRepositoryPort txPort;
    private final AccountRepositoryPort accountPort;
    private final AntiFraudPort antiFraudPort;

    public CreateTransactionService(TransactionRepositoryPort txPort,
                                    AccountRepositoryPort accountPort,
                                    AntiFraudPort antiFraudPort) {
        this.txPort = txPort;
        this.accountPort = accountPort;
        this.antiFraudPort = antiFraudPort;
    }


    @Override
    public Mono<TransactionResult> create(CreateTransactionCommand command) {
        if (command == null) return Mono.error(new BadRequestException("Request body is required"));
        if (command.value() == null || command.value() <= 0) return Mono.error(new BadRequestException("value must be > 0"));
        if (command.transferTypeId() == null || command.transferTypeId().isBlank())
            return Mono.error(new BadRequestException("transferTypeId is required"));

        UUID accountId = (command.accountExternalIdCredit() != null)
                ? command.accountExternalIdCredit()
                : command.accountExternalIdDebit();

        if (accountId == null) {
            return Mono.error(new BadRequestException("Either accountExternalIdCredit or accountExternalIdDebit is required"));
        }

        TransactionType type = mapTransferType(command.transferTypeId());

        // 1) validate account exists
        return accountPort.findById(accountId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(
                        "Account", "id", accountId
                )))
                // 2) create & save transaction
                .then(Mono.defer(() -> txPort.save(Transaction.createNew(accountId, type, command.value()))))
                // 3) send to anti-fraud
                .flatMap(saved ->
                        antiFraudPort.send(saved)
                                .onErrorResume(e -> Mono.just("antifraud_error")) //not fail the whole flow if antifraud fails
                                .thenReturn(saved)
                )
                // 4) map to result object
                .map(saved -> new TransactionResult(
                        saved.getId(),
                        saved.getStatus(),
                        saved.getType(),
                        saved.getAmount(),
                        saved.getCreatedAt(),
                        saved.getUpdatedAt(),
                        saved.getAccountId()
                ));

    }

    private TransactionType mapTransferType(String transferTypeId) {
        try {
            return TransactionType.valueOf(transferTypeId.trim().toUpperCase());
        } catch (Exception e) {
            // fallback (o BadRequest)
            return TransactionType.FAST;
        }
    }
}
