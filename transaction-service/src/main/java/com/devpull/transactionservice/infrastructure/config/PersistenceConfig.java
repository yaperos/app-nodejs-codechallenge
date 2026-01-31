package com.devpull.transactionservice.infrastructure.config;

import com.devpull.transactionservice.domain.enums.AccountStatus;
import com.devpull.transactionservice.domain.enums.AccountType;
import com.devpull.transactionservice.domain.enums.TransactionStatus;
import com.devpull.transactionservice.domain.enums.TransactionType;
import io.r2dbc.spi.ConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

import java.util.List;

@Configuration
public class PersistenceConfig {

    @Bean
    public R2dbcEntityTemplate r2dbcEntityTemplate(ConnectionFactory connectionFactory) {
        return new R2dbcEntityTemplate(connectionFactory);
    }

    @Bean
    public ReactiveTransactionManager reactiveTransactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }

    @Bean
    public TransactionalOperator transactionalOperator(ReactiveTransactionManager txManager) {
        return TransactionalOperator.create(txManager);
    }

    @Bean
    public R2dbcCustomConversions r2dbcCustomConversions() {
        List<Converter<?, ?>> converters = List.of(
                new TransactionStatusReadConverter(),
                new TransactionStatusWriteConverter(),
                new TransactionTypeReadConverter(),
                new TransactionTypeWriteConverter(),
                new AccountStatusReadConverter(),
                new AccountStatusWriteConverter(),
                new AccountTypeReadConverter(),
                new AccountTypeWriteConverter()
        );

        return new R2dbcCustomConversions(R2dbcCustomConversions.STORE_CONVERSIONS, converters);
    }

    // ---------- TransactionStatus ----------
    @ReadingConverter
    static class TransactionStatusReadConverter implements Converter<String, TransactionStatus> {
        @Override public TransactionStatus convert(String source) {
            return source == null ? null : TransactionStatus.valueOf(source.trim().toUpperCase());
        }
    }

    @WritingConverter
    static class TransactionStatusWriteConverter implements Converter<TransactionStatus, String> {
        @Override public String convert(TransactionStatus source) {
            return source == null ? null : source.name();
        }
    }

    // ---------- TransactionType ----------
    @ReadingConverter
    static class TransactionTypeReadConverter implements Converter<String, TransactionType> {
        @Override public TransactionType convert(String source) {
            return source == null ? null : TransactionType.valueOf(source.trim().toUpperCase());
        }
    }

    @WritingConverter
    static class TransactionTypeWriteConverter implements Converter<TransactionType, String> {
        @Override public String convert(TransactionType source) {
            return source == null ? null : source.name();
        }
    }

    // ---------- AccountStatus ----------
    @ReadingConverter
    static class AccountStatusReadConverter implements Converter<String, AccountStatus> {
        @Override public AccountStatus convert(String source) {
            return source == null ? null : AccountStatus.valueOf(source.trim().toUpperCase());
        }
    }

    @WritingConverter
    static class AccountStatusWriteConverter implements Converter<AccountStatus, String> {
        @Override public String convert(AccountStatus source) {
            return source == null ? null : source.name();
        }
    }

    // ---------- AccountType ----------
    @ReadingConverter
    static class AccountTypeReadConverter implements Converter<String, AccountType> {
        @Override public AccountType convert(String source) {
            return source == null ? null : AccountType.valueOf(source.trim().toUpperCase());
        }
    }

    @WritingConverter
    static class AccountTypeWriteConverter implements Converter<AccountType, String> {
        @Override public String convert(AccountType source) {
            return source == null ? null : source.name();
        }
    }
}
