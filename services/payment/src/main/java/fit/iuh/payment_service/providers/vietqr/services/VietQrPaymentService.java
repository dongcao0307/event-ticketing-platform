package fit.iuh.payment_service.providers.vietqr.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrCreatePaymentRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrWebhookRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrCreatePaymentResponse;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrWebhookResponse;

public interface VietQrPaymentService {
    VietQrCreatePaymentResponse createPayment(VietQrCreatePaymentRequest request);

    VietQrWebhookResponse handleWebhook(VietQrWebhookRequest request);

    PaymentStatusResponse getPaymentStatus(Long paymentId);
}
