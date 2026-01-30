package pe.com.yape.transaction;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import pe.com.yape.transaction.models.entities.AccountEntity;
import pe.com.yape.transaction.repositories.AccountRepository;
import pe.com.yape.transaction.repositories.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@SpringBootApplication
@EnableAsync
public class TransactionMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransactionMicroserviceApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(
			AccountRepository accountRepository,
			TransactionRepository transactionRepository) {
		return args -> {
			transactionRepository.deleteAll();
			accountRepository.deleteAll();

			AccountEntity account1 = AccountEntity.builder()
					.firstName("Juan Ramón")
					.lastName("Perez Lopez")
					.balance(new BigDecimal("1000.00"))
					.createdAt(LocalDateTime.now())
					.build();

			AccountEntity account2 = AccountEntity.builder()
					.firstName("Karla Luana")
					.lastName("Gomez Santiago")
					.balance(new BigDecimal("2000.00"))
					.createdAt(LocalDateTime.now())
					.build();

			accountRepository.saveAll(Arrays.asList(account1, account2));
		};
	}

}
