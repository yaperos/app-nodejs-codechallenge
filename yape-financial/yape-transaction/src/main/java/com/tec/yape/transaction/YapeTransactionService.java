package com.tec.yape.transaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class YapeTransactionService {
    public static void main(String[] args) {
        SpringApplication.run(YapeTransactionService.class, args);
    }
}