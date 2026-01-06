package com.yape.antifraud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

/**
 * Aplicación principal - Anti-Fraud Service
 */
@EnableKafka
@SpringBootApplication
public class AntiFraudServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AntiFraudServiceApplication.class, args);
    }
}

