package fit.iuh.payment_service.providers.vnpay.mappers;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.PaymentMethod;
import fit.iuh.payment_service.entities.PaymentStatus;
import fit.iuh.payment_service.entities.Transaction;
import fit.iuh.payment_service.messaging.PaymentStatusChangedEvent;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayCreatePaymentRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayCreatePaymentResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayIpnResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface VnPayPaymentMapper {
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
    Payment toPayment(VnPayCreatePaymentRequest request, PaymentMethod paymentMethod, String paymentToken,
                      BigDecimal feeAmount, BigDecimal organizerAmount, PaymentStatus status);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "paymentToken", source = "payment.paymentToken")
    @Mapping(target = "initTransactionId", source = "initTransactionId")
    @Mapping(target = "providerName", source = "providerName")
    @Mapping(target = "txnRef", source = "txnRef")
    @Mapping(target = "paymentUrl", source = "paymentUrl")
    @Mapping(target = "expiresAt", source = "expiresAt")
    @Mapping(target = "status", source = "payment.status")
    VnPayCreatePaymentResponse toCreatePaymentResponse(Payment payment, String initTransactionId,
                                                       String providerName, String txnRef,
                                                       String paymentUrl, LocalDateTime expiresAt);

    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "status", source = "payment.status")
    @Mapping(target = "transactionId", source = "transaction.id")
    @Mapping(target = "providerTransactionId", source = "transaction.providerTransactionId")
    VnPayIpnResponse toIpnResponse(Payment payment, Transaction transaction);

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
