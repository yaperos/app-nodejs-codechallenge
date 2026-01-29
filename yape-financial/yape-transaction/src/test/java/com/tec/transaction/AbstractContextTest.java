package com.tec.transaction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.nio.file.Files;
import java.nio.file.Paths;

@ExtendWith(SpringExtension.class)
@TestPropertySource(locations = "classpath:application-test.properties")
public class AbstractContextTest {

    protected static final String DEFAULT_TOKEN = "";
    protected static ObjectMapper objectMapper;

    static {
        objectMapper = getObjectMapper();
    }


    protected static String getJsonFromPath(String pathJson) throws Exception {
        return new String(Files.readAllBytes(Paths.get(AbstractContextTest.class.getResource(pathJson).toURI())));
    }

    protected static <T> T convertTo(String path, Class<T> aClass) throws Exception {
        String jsonRequest = getJsonFromPath(path);
        return objectMapper.readValue(jsonRequest, aClass);
    }

    public static String convertToJSONString(Object object) throws JsonProcessingException {
        ObjectMapper mapper = getObjectMapper();
        return mapper.writeValueAsString(object);
    }

    public static ObjectMapper getObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.registerModule(new Jdk8Module());
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

}
