package pe.yape.antifraud.application;

import org.springframework.stereotype.Service;
import pe.yape.antifraud.api.dto.AntifraudValidateRequest;
import pe.yape.antifraud.api.dto.AntifraudValidateResponse;

@Service
public class AntifraudService {

    public AntifraudValidateResponse validate(AntifraudValidateRequest req) {

        if (req.value().doubleValue() >= 1000) {
            return new AntifraudValidateResponse("REJECTED", 20);
        }

        return new AntifraudValidateResponse("APPROVED", 90);
    }
}