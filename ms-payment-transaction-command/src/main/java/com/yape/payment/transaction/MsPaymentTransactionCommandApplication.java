package com.yape.payment.transaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MsPaymentTransactionCommandApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPaymentTransactionCommandApplication.class, args);

	}
}
