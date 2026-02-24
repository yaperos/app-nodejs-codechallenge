package pe.yape.transactions.application.mapper;

import org.springframework.stereotype.Component;
import pe.yape.transactions.api.dto.NameDto;
import pe.yape.transactions.api.dto.TransactionResponse;
import pe.yape.transactions.domain.model.Transaction;

@Component
public class TransactionMapper {

    public TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getTransactionExternalId(),
                new NameDto("TRANSFER"),
                new NameDto(t.getStatus().name()),
                t.getValue(),
                t.getCreatedAt()
        );
    }
}