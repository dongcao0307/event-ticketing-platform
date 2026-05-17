package fit.iuh.payment_service.providers.vnpay.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayCreatePaymentRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayIpnRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayCreatePaymentResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayGatewayIpnResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayIpnResponse;

import java.util.Map;

public interface VnPayPaymentService {
    VnPayCreatePaymentResponse createPayment(VnPayCreatePaymentRequest request);

    VnPayIpnResponse handleIpn(VnPayIpnRequest request);

    VnPayGatewayIpnResponse handleGatewayIpn(Map<String, String> queryParams);

    PaymentStatusResponse getPaymentStatus(Long paymentId);
}
