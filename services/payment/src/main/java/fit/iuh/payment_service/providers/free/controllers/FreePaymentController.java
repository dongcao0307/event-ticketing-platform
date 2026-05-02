package fit.iuh.payment_service.providers.free.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.free.dtos.requests.FreeCreatePaymentRequest;
import fit.iuh.payment_service.providers.free.dtos.responses.FreeCreatePaymentResponse;
import fit.iuh.payment_service.providers.free.services.FreePaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/free")
@RequiredArgsConstructor
public class FreePaymentController {
    private final FreePaymentService freePaymentService;

    @PostMapping("/checkout")
    public ApiResponse<FreeCreatePaymentResponse> checkout(@Valid @RequestBody FreeCreatePaymentRequest request) {
        return ApiResponse.<FreeCreatePaymentResponse>builder()
                .body(freePaymentService.createPayment(request))
                .build();
    }

    @GetMapping("/{paymentId}/status")
    public ApiResponse<PaymentStatusResponse> status(@PathVariable Long paymentId) {
        return ApiResponse.<PaymentStatusResponse>builder()
                .body(freePaymentService.getPaymentStatus(paymentId))
                .build();
    }
}
