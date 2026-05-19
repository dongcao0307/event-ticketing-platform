package fit.iuh.payment_service.providers.momo.mappers;

import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.Transaction;
import fit.iuh.payment_service.entities.TransactionStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface MoMoTransactionMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "providerResponse", source = "providerResponse")
    @Mapping(target = "timestamp", source = "timestamp")
    @Mapping(target = "providerTransactionId", source = "providerTransactionId")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "payment", source = "payment")
    Transaction toTransaction(String id, String providerResponse, LocalDateTime timestamp,
                              String providerTransactionId, TransactionStatus status, Payment payment);
}
