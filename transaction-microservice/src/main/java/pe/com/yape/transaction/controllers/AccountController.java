package pe.com.yape.transaction.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pe.com.yape.transaction.models.dtos.CreateAccountRequest;
import pe.com.yape.transaction.models.dtos.UpdateAccountRequest;
import pe.com.yape.transaction.models.entities.AccountEntity;
import pe.com.yape.transaction.services.AccountService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    public AccountEntity create(@Valid @RequestBody CreateAccountRequest request) {
        return service.create(request);
    }

    @GetMapping("/{externalId}")
    public AccountEntity getById(@PathVariable UUID externalId) {
        return service.getByExternalId(externalId);
    }

    @GetMapping
    public List<AccountEntity> getAll() {
        return service.getAll();
    }

    @PutMapping("/{externalId}")
    public AccountEntity update(
            @PathVariable UUID externalId,
            @Valid @RequestBody UpdateAccountRequest request) {
        return service.update(externalId, request);
    }
}
