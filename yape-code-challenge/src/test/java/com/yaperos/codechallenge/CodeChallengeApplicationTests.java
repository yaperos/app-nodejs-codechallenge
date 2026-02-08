package com.yaperos.codechallenge;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {"transaction-created", "transaction-status", "transaction-created.DLT", "transaction-status.DLT"})
@ActiveProfiles("test")
class CodeChallengeApplicationTests {

	@Test
	void contextLoads() {
	}

}
