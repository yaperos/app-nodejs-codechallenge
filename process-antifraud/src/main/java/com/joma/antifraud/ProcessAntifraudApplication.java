package com.joma.antifraud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class ProcessAntifraudApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcessAntifraudApplication.class, args);
    }

}
