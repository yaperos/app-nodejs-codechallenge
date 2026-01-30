package pe.com.yape.transaction.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import pe.com.yape.transaction.models.dtos.CreateAccountRequest;
import pe.com.yape.transaction.models.dtos.UpdateAccountRequest;
import pe.com.yape.transaction.models.entities.AccountEntity;
import pe.com.yape.transaction.repositories.AccountRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository repository;

    public AccountEntity create(CreateAccountRequest request) {

        AccountEntity entity = AccountEntity.builder()
                //.accountExternalId(UUID.randomUUID())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .balance(request.getInitialBalance())
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(entity);
    }

    public AccountEntity getByExternalId(UUID externalId) {
        return repository.findByAccountExternalId(externalId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }

    public List<AccountEntity> getAll() {
        return repository.findAllByOrderByFirstNameAsc();
    }

    public AccountEntity update(UUID externalId, UpdateAccountRequest request) {

        AccountEntity entity = getByExternalId(externalId);

        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());

        return repository.save(entity);
    }
}
