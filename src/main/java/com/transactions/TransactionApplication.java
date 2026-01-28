package com.transactions;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TransactionApplication {
  public static void main(String[] args) {
    SpringApplication.run(TransactionApplication.class, args);
    System.out.println("🚀 Transaction Service started on port 8080");
    System.out.println("📊 H2 Console: http://localhost:8080/h2-console");
    System.out.println("📝 JDBC URL: jdbc:h2:mem:transactionsdb");
    System.out.println("👤 Username: sa");
    System.out.println("🔑 Password: (empty)");
  }
}