package com.devpull.transactionservice.adapter.in.web;

import com.devpull.transactionservice.adapter.in.web.dto.TransactionRequest;
import com.devpull.transactionservice.adapter.in.web.dto.TransactionResponse;
import com.devpull.transactionservice.adapter.in.web.mapper.TransactionWebMapper;
import com.devpull.transactionservice.application.port.in.CreateTransactionUseCase;
import com.devpull.transactionservice.application.port.in.GetTransactionUseCase;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final GetTransactionUseCase getTransactionUseCase;
    private final CreateTransactionUseCase createTransactionUseCase;

    @GetMapping("{id}")
    public Mono<ResponseEntity<TransactionResponse>> getTransaction(@PathVariable("id") UUID transactionId) {
        return getTransactionUseCase.getById(transactionId)
                .map(TransactionWebMapper::toResponse)
                .map(ResponseEntity::ok);
    }

    @PostMapping
    public Mono<ResponseEntity<TransactionResponse>> createTransaction(@RequestBody TransactionRequest request) {
        return createTransactionUseCase.create(TransactionWebMapper.toCommand(request))
                .map(TransactionWebMapper::toResponse)
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res));
    }
}
