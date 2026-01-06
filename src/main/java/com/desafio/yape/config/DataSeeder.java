package com.desafio.yape.config;

import com.desafio.yape.model.TransactionStatus;
import com.desafio.yape.model.TransactionType;
import com.desafio.yape.repository.TransactionStatusRepository;
import com.desafio.yape.repository.TransactionTypeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    private final TransactionStatusRepository statusRepository;
    private final TransactionTypeRepository typeRepository;

    public DataSeeder(TransactionStatusRepository statusRepository, TransactionTypeRepository typeRepository) {
        this.statusRepository = statusRepository;
        this.typeRepository = typeRepository;
    }

    @PostConstruct
    public void seed() {
        if (statusRepository.findByName("pendiente").isEmpty()) {
            TransactionStatus p = new TransactionStatus(); p.setName("pendiente"); statusRepository.save(p);
        }
        if (statusRepository.findByName("aprobado").isEmpty()) {
            TransactionStatus a = new TransactionStatus(); a.setName("aprobado"); statusRepository.save(a);
        }
        if (statusRepository.findByName("rechazado").isEmpty()) {
            TransactionStatus r = new TransactionStatus(); r.setName("rechazado"); statusRepository.save(r);
        }

        if (typeRepository.findByName("transfer").isEmpty()) {
            TransactionType t = new TransactionType(); t.setName("transfer"); typeRepository.save(t);
        }
    }
}
