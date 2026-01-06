package pe.com.yape.orchestrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MS-UX-ORCHESTRATOR
 * Backend for Frontend (BFF) - Punto de entrada del sistema
 * 
 * @author Yape Engineering Team
 * @version 1.0.0
 */
@SpringBootApplication
public class OrchestratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrchestratorApplication.class, args);
    }
}

