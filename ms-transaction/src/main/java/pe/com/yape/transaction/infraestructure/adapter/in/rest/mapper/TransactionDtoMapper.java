package pe.com.yape.transaction.infraestructure.adapter.in.rest.mapper;

import org.springframework.stereotype.Component;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.dto.TransactionResponse;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.dto.TransactionStatusDto;
import pe.com.yape.transaction.infraestructure.adapter.in.rest.dto.TransactionTypeDto;

@Component
public class TransactionDtoMapper {

    public static TransactionResponse toResponse(Transaction transaction) {

        TransactionTypeDto typeDto =
                new TransactionTypeDto(
                        "Transfer Type " + transaction.getTransferTypeId().getValue()
                );

        TransactionStatusDto statusDto =
                new TransactionStatusDto(
                        transaction.getStatus().getName()
                );

        return new TransactionResponse(
                transaction.getTransactionExternalId().getValue(),
                typeDto,
                statusDto,
                transaction.getAmount().getValue().doubleValue(),
                transaction.getCreatedAt()
        );
    }

}
