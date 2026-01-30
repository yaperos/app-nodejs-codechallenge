package pe.com.yape.transaction.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.com.yape.transaction.models.entities.AccountEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {

    Optional<AccountEntity> findByAccountExternalId(UUID accountExternalId);
    List<AccountEntity> findAllByOrderByFirstNameAsc();

}