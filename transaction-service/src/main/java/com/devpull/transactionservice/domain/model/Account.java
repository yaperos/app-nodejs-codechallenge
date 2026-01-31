package com.devpull.transactionservice.domain.model;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;
import lombok.Getter;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Getter
public class Account {

    private final UUID id;
    private AccountStatus accountStatus;
    private final AccountType accountType;
    private final Instant createdAt;

    private Account(UUID id, AccountStatus accountStatus, AccountType accountType, Instant createdAt) {
        this.id = Objects.requireNonNull(id, "id must not be null");
        this.accountStatus = Objects.requireNonNull(accountStatus, "accountStatus must not be null");
        this.accountType = Objects.requireNonNull(accountType, "accountType must not be null");
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt must not be null");

        validateInvariants();
    }

    /**
     * Factory: to create a new account obj.
     */
    public static Account createNew(AccountStatus accountStatus, AccountType accountType) {
        return new Account(
                UUID.randomUUID(),
                accountStatus,
                accountType,
                Instant.now()
        );
    }

    /**
     * Factory: to work from persistence slice (already exists).
     */
    public static Account rehydrate(UUID id, AccountStatus accountStatus, AccountType accountType, Instant createdAt) {
        return new Account(id, accountStatus, accountType, createdAt);
    }

    /**
     * Domain behavior example.
     */
    public void activate() {
        if (this.accountStatus == AccountStatus.AVAILABLE) return;

        if (this.accountStatus == AccountStatus.UNAVAILABLE) {
            throw new IllegalStateException("A closed account cannot be activated");
        }
        this.accountStatus = AccountStatus.AVAILABLE;
    }

    public void suspend() {
        if (this.accountStatus == AccountStatus.UNAVAILABLE) {
            throw new IllegalStateException("A closed account cannot be suspended");
        }
        this.accountStatus = AccountStatus.UNAVAILABLE;
    }

    public void close() {
        this.accountStatus = AccountStatus.UNAVAILABLE;
    }

    public boolean isActive() {
        return this.accountStatus == AccountStatus.AVAILABLE;
    }

    private void validateInvariants() {
        if (accountStatus == AccountStatus.UNAVAILABLE) {
            throw new IllegalArgumentException("Account cannot be created with status CLOSED");
        }
    }

}
