package fit.iuh.payment_service.providers.momo.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoCreatePaymentRequest;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoIpnRequest;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoCreatePaymentResponse;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoIpnResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.providers.common.dtos.ProviderRefundResult;

import java.math.BigDecimal;

public interface MoMoPaymentService {
    MoMoCreatePaymentResponse createPayment(MoMoCreatePaymentRequest request);

    MoMoIpnResponse handleIpn(MoMoIpnRequest request);

    PaymentStatusResponse getPaymentStatus(Long paymentId);

    ProviderRefundResult refund(String refundRequestId, Payment payment, BigDecimal refundAmount, String reason);
}
