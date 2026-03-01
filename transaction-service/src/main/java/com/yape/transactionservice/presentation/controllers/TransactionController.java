package com.yape.transactionservice.presentation.controllers;

import com.yape.transactionservice.application.abstractions.CreateTransactionUseCase;
import com.yape.transactionservice.application.abstractions.GetByIdTransactionUseCase;
import com.yape.transactionservice.application.abstractions.GetTransactionUseCase;
import com.yape.transactionservice.application.usecases.createtransaction.CreateTransactionRequest;
import com.yape.transactionservice.application.usecases.createtransaction.CreateTransactionResponse;
import com.yape.transactionservice.application.usecases.getbyidtransaction.GetByIdTransactionRequest;
import com.yape.transactionservice.application.usecases.getbyidtransaction.GetByIdTransactionResponse;
import com.yape.transactionservice.application.usecases.gettransaction.GetTransactionRequest;
import com.yape.transactionservice.application.usecases.gettransaction.GetTransactionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;
    private final GetByIdTransactionUseCase getByIdTransactionUseCase;

    public TransactionController(CreateTransactionUseCase createTransactionUseCase,
                                 GetTransactionUseCase getTransactionUseCase,
                                 GetByIdTransactionUseCase getByIdTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
        this.getByIdTransactionUseCase = getByIdTransactionUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateTransactionResponse createTransaction(@RequestBody @Valid CreateTransactionRequest request) {
        return createTransactionUseCase.execute(request);
    }

    @GetMapping
    public List<GetTransactionResponse> getAll() {
        return getTransactionUseCase.execute(new GetTransactionRequest());
    }

    @GetMapping("/{id}")
    public GetByIdTransactionResponse getById(@PathVariable UUID id) {
        return getByIdTransactionUseCase.execute(new GetByIdTransactionRequest(id));
    }
}
