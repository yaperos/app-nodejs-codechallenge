package com.yape.business.financial.infrastructure.web;

import com.yape.business.financial.infrastructure.events.command.CommandBus;
import com.yape.business.financial.infrastructure.events.command.CreateTransactionCommand;
import com.yape.business.financial.infrastructure.web.request.CreateTransactionRequest;
import com.yape.shared.domain.TransactionStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/financial-transaction")
@Slf4j
@AllArgsConstructor
public class ServiceController {
    private final CommandBus commandBus;

    @PostMapping()
    public Mono<ResponseEntity<Void>> create(@RequestBody CreateTransactionRequest request) {
        UUID txId = UUID.randomUUID();

        commandBus.dispatch(CreateTransactionCommand.from(txId, request));

        return Mono.just(ResponseEntity
                .accepted()
                .header(HttpHeaders.LOCATION, "/financial-transaction/" + txId)
                .build());
    }
}
