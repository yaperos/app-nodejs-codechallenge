package com.yape.business.financial.infrastructure.events.command;

import com.yape.business.financial.infrastructure.web.request.CreateTransactionRequest;
import com.yape.shared.domain.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CreateTransactionCommand implements CommandInterface {
    private UUID id;
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private Integer transferTypeId;
    private TransactionStatus transferStatus;
    private BigDecimal value;

    public static CreateTransactionCommand from(UUID id, CreateTransactionRequest request) {
        return CreateTransactionCommand.builder()
                .id(id)
                .accountExternalIdDebit(request.accountExternalIdDebit())
                .accountExternalIdCredit(request.accountExternalIdCredit())
                .transferTypeId(request.transferTypeId())
                .value(request.value())
                .transferStatus(TransactionStatus.PENDING)
                .build();
    }
}
