package fit.iuh.payment_service.providers.momo.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoCreatePaymentRequest;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoIpnRequest;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoCreatePaymentResponse;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoIpnResponse;

public interface MoMoPaymentService {
    MoMoCreatePaymentResponse createPayment(MoMoCreatePaymentRequest request);

    MoMoIpnResponse handleIpn(MoMoIpnRequest request);

    PaymentStatusResponse getPaymentStatus(Long paymentId);
}
