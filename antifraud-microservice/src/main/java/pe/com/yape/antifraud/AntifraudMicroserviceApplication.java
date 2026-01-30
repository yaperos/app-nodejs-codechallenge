package pe.com.yape.antifraud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AntifraudMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AntifraudMicroserviceApplication.class, args);
	}

}
