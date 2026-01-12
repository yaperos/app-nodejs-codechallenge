package com.msucre.transaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@EnableR2dbcRepositories(
		basePackages = "com.company.transaction.infrastructure.postgres.repository"
)
public class TransactionManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransactionManagerApplication.class, args);
	}

}
