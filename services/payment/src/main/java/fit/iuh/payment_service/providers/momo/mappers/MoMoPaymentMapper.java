package fit.iuh.payment_service.providers.momo.mappers;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.PaymentMethod;
import fit.iuh.payment_service.entities.PaymentStatus;
import fit.iuh.payment_service.entities.Transaction;
import fit.iuh.payment_service.messaging.PaymentStatusChangedEvent;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoCreatePaymentRequest;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoCreatePaymentResponse;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoIpnResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface MoMoPaymentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderId", source = "request.orderId")
    @Mapping(target = "eventId", source = "request.eventId")
    @Mapping(target = "eventPerformanceId", source = "request.eventPerformanceId")
    @Mapping(target = "amount", source = "request.amount")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "paymentToken", source = "paymentToken")
    @Mapping(target = "feeAmount", source = "feeAmount")
    @Mapping(target = "organizerAmount", source = "organizerAmount")
    @Mapping(target = "status", source = "status")
    Payment toPayment(MoMoCreatePaymentRequest request, PaymentMethod paymentMethod, String paymentToken,
                      BigDecimal feeAmount, BigDecimal organizerAmount, PaymentStatus status);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "paymentToken", source = "payment.paymentToken")
    @Mapping(target = "initTransactionId", source = "initTransactionId")
    @Mapping(target = "providerName", source = "providerName")
    @Mapping(target = "requestId", source = "requestId")
    @Mapping(target = "orderRef", source = "orderRef")
    @Mapping(target = "paymentUrl", source = "paymentUrl")
    @Mapping(target = "expiresAt", source = "expiresAt")
    @Mapping(target = "status", source = "payment.status")
    MoMoCreatePaymentResponse toCreatePaymentResponse(Payment payment, String initTransactionId,
                                                      String providerName, String requestId,
                                                      String orderRef, String paymentUrl,
                                                      LocalDateTime expiresAt);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "status", source = "payment.status")
    @Mapping(target = "transactionId", source = "transaction.id")
    @Mapping(target = "providerTransactionId", source = "transaction.providerTransactionId")
    @Mapping(target = "resultCode", source = "resultCode")
    @Mapping(target = "message", source = "message")
    MoMoIpnResponse toIpnResponse(Payment payment, Transaction transaction, Integer resultCode, String message);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "paymentToken", source = "payment.paymentToken")
    @Mapping(target = "status", source = "payment.status")
    PaymentStatusResponse toPaymentStatusResponse(Payment payment);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "orderId", source = "payment.orderId")
    @Mapping(target = "eventId", source = "payment.eventId")
    @Mapping(target = "status", source = "payment.status")
    @Mapping(target = "occurredAt", source = "occurredAt")
    PaymentStatusChangedEvent toPaymentStatusChangedEvent(Payment payment, LocalDateTime occurredAt);
}
