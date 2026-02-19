package com.yape.yape.infrastructure.controller;

import com.yape.yape.application.dto.CreateTransactionRequestDto;
import com.yape.yape.application.dto.DeleteTransactionResponseDto;
import com.yape.yape.application.dto.TransactionResponseDto;
import com.yape.yape.application.dto.UpdateTransactionRequestDto;
import com.yape.yape.application.usecase.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final CreateTransactionUseCase createUseCase;
    private final GetTransactionUseCase getUseCase;
    private final DeleteTransactionUseCase deleteUseCase;
    private final UpdateTransactionUseCase updateUseCase;

    public TransactionController(
            CreateTransactionUseCase createUseCase,
            GetTransactionUseCase getUseCase,
            DeleteTransactionUseCase deleteUseCase,
            UpdateTransactionUseCase updateUseCase
    ) {
        this.createUseCase = createUseCase;
        this.getUseCase = getUseCase;
        this.deleteUseCase = deleteUseCase;
        this.updateUseCase = updateUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponseDto create(@Valid @RequestBody CreateTransactionRequestDto request) {
        return createUseCase.execute(request);
    }

    @GetMapping("/{externalId}")
    public TransactionResponseDto get(@PathVariable UUID externalId) {
        return getUseCase.execute(externalId);
    }

    @PutMapping("/{externalId}")
    public TransactionResponseDto update(@PathVariable UUID externalId,
                                         @Valid @RequestBody UpdateTransactionRequestDto request) {
        return updateUseCase.execute(externalId, request);
    }

    @DeleteMapping("/{externalId}")
    public DeleteTransactionResponseDto delete(@PathVariable UUID externalId) {
        deleteUseCase.execute(externalId);

        return new DeleteTransactionResponseDto(
                "Transaction deleted successfully",
                externalId.toString()
        );
    }

}
