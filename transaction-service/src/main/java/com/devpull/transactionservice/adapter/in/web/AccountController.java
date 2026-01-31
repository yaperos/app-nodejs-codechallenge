package com.devpull.transactionservice.adapter.in.web;

import com.devpull.transactionservice.adapter.in.web.dto.AccountRequest;
import com.devpull.transactionservice.adapter.in.web.dto.AccountResponse;
import com.devpull.transactionservice.adapter.in.web.mapper.AccountWebMapper;
import com.devpull.transactionservice.application.port.in.CreateAccountUseCase;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final CreateAccountUseCase createAccountUseCase;


    @PostMapping
    public Mono<ResponseEntity<AccountResponse>> createAccount(@RequestBody AccountRequest request) {
        return createAccountUseCase.createAccount(AccountWebMapper.toCommand(request))
                .map(AccountWebMapper::toResponse)
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res));
    }
}
