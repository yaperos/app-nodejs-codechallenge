package com.kafka.anti_fraude;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication()
public class YapeAntiFraudeApplication {

	public static void main(String[] args) {
		SpringApplication.run(YapeAntiFraudeApplication.class, args);
	}

}
