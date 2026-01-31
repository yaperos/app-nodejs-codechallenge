package com.devpull.transactionservice.adapter.out.persistence.entity;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "accounts")
public class AccountEntity implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("status")
    private AccountStatus status;

    @Column("type")
    private AccountType type;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

    @Transient
    private boolean isNew;

    public static AccountEntity newAccount(UUID id, AccountStatus status, AccountType type, Instant now) {
        return new AccountEntity(id, status, type, now, now, true);
    }

    public AccountEntity markNotNew() {
        this.isNew = false;
        return this;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }
}
