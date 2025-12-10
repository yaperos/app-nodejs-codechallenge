package com.pe.yape.service.challenge.transactions;

import com.pe.yape.service.challenge.transactions.config.KafkaReactiveConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(KafkaReactiveConfig.class)
public class AppTransactionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppTransactionServiceApplication.class, args);
	}

}
