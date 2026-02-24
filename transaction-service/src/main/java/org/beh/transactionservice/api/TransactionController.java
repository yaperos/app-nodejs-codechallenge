package org.beh.transactionservice.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.transactionservice.application.command.CreateTransactionCommand;
import org.beh.transactionservice.application.dto.TransactionDTO;
import org.beh.transactionservice.application.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

/**
 * POST /api/v1/transactions
 *
 * Request:
 * {
 *   "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "accountExternalIdCredit": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
 *   "tranferTypeId": 1,
 *   "value": 120
 * }
 *
 * Response 201:
 * {
 *   "transactionExternalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "transactionType": { "name": "WIRE_TRANSFER" },
 *   "transactionStatus": { "name": "PENDING" },
 *   "value": 120,
 *   "createdAt": "2024-01-15T10:30:00"
 * }
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * GET /api/v1/transactions/{transactionExternalId}
 *
 * Response 200:
 * {
 *   "transactionExternalId": "Guid",
 *   "transactionType": { "name": "" },
 *   "transactionStatus": { "name": "" },
 *   "value": 120,
 *   "createdAt": "Date"
 * }
 */
@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Creates a new transaction and immediately returns it with PENDING status.
     * Anti-fraud evaluation happens asynchronously via Kafka — poll GET to check
     * final status (APPROVED or REJECTED).
     */
    @PostMapping
    public ResponseEntity<TransactionDTO> create(@Valid @RequestBody CreateTransactionCommand command) {
        TransactionDTO dto = transactionService.createTransaction(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/transactions/" + dto.getTransactionExternalId()))
                .body(dto);
    }

    /**
     * Retrieves a transaction by its external ID.
     * Served from Redis cache when available (< 1ms), falls back to PostgreSQL.
     */
    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionDTO> get(@PathVariable UUID transactionExternalId) {
        return ResponseEntity.ok(transactionService.getTransaction(transactionExternalId));
    }

}
