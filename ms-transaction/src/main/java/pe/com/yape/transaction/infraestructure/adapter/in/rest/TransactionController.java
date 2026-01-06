package pe.com.yape.transaction.infraestructure.adapter.in.rest;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.AccountExternalId;
import pe.com.yape.transaction.domain.model.valueObjects.Amount;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.model.valueObjects.TransferTypeId;
import pe.com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import pe.com.yape.transaction.domain.port.in.GetTransactionUseCase;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.dto.CreateTransactionRequest;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.dto.TransactionResponse;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.mapper.TransactionDtoMapper;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;


    public TransactionController(
            CreateTransactionUseCase createTransactionUseCase,
            GetTransactionUseCase getTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest createTransactionRequest
            ){

        Transaction transaction = createTransactionUseCase.create(
                AccountExternalId.of(createTransactionRequest.getAccountExternalIdDebit().toString()),
                AccountExternalId.of(createTransactionRequest.getAccountExternalIdCredit().toString()),
                TransferTypeId.of(createTransactionRequest.getTransferTypeId()),
                Amount.of(createTransactionRequest.getValue())
        );


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TransactionDtoMapper.toResponse(transaction));

    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable UUID transactionExternalId) {

        logger.info("Received request to get transaction with ID: {}", transactionExternalId);

        Transaction transaction = getTransactionUseCase.getById(
                TransactionId.of(transactionExternalId.toString())
        );

        return ResponseEntity.status(HttpStatus.OK)
                .body(TransactionDtoMapper.toResponse(transaction));
    }

}
