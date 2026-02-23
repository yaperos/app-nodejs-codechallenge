package com.kafka.productor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication()
@ComponentScan(basePackages = "com.kafka.productor")
public class YapeProductorApplication {

	public static void main(String[] args) {
		SpringApplication.run(YapeProductorApplication.class, args);
	}

}
