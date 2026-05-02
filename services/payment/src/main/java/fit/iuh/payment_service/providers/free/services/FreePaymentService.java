package fit.iuh.payment_service.providers.free.services;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.free.dtos.requests.FreeCreatePaymentRequest;
import fit.iuh.payment_service.providers.free.dtos.responses.FreeCreatePaymentResponse;

public interface FreePaymentService {
    FreeCreatePaymentResponse createPayment(FreeCreatePaymentRequest request);

    PaymentStatusResponse getPaymentStatus(Long paymentId);
}
