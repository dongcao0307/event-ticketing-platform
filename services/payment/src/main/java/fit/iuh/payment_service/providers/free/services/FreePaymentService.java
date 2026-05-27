package fit.iuh.payment_service.providers.free.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.providers.free.dtos.requests.FreeCreatePaymentRequest;
import fit.iuh.payment_service.providers.free.dtos.responses.FreeCreatePaymentResponse;
import fit.iuh.payment_service.providers.common.dtos.ProviderRefundResult;

import java.math.BigDecimal;

public interface FreePaymentService {
    FreeCreatePaymentResponse createPayment(FreeCreatePaymentRequest request);

    PaymentStatusResponse getPaymentStatus(Long paymentId);

    ProviderRefundResult refund(String refundRequestId, Payment payment, BigDecimal refundAmount, String reason);
}
