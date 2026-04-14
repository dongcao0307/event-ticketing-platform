package fit.iuh.payment_service.providers.vietqr.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrCreatePaymentRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrWebhookRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrCreatePaymentResponse;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrWebhookResponse;
import fit.iuh.payment_service.providers.vietqr.services.VietQrPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/vietqr")
@RequiredArgsConstructor
public class VietQrPaymentController {
    private final VietQrPaymentService vietQrPaymentService;

    @PostMapping("/checkout")
    public ApiResponse<VietQrCreatePaymentResponse> checkout(@Valid @RequestBody VietQrCreatePaymentRequest request) {
        return ApiResponse.<VietQrCreatePaymentResponse>builder()
                .body(vietQrPaymentService.createPayment(request))
                .build();
    }

    @PostMapping("/webhook")
    public ApiResponse<VietQrWebhookResponse> webhook(@Valid @RequestBody VietQrWebhookRequest request) {
        return ApiResponse.<VietQrWebhookResponse>builder()
                .body(vietQrPaymentService.handleWebhook(request))
                .build();
    }

    @GetMapping("/{paymentId}/status")
    public ApiResponse<PaymentStatusResponse> status(@PathVariable Long paymentId) {
        return ApiResponse.<PaymentStatusResponse>builder()
                .body(vietQrPaymentService.getPaymentStatus(paymentId))
                .build();
    }
}