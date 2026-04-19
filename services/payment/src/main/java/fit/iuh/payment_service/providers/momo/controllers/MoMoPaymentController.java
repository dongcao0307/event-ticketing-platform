package fit.iuh.payment_service.providers.momo.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoCreatePaymentRequest;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoIpnRequest;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoCreatePaymentResponse;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoIpnResponse;
import fit.iuh.payment_service.providers.momo.services.MoMoPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/momo")
@RequiredArgsConstructor
public class MoMoPaymentController {
    private final MoMoPaymentService moMoPaymentService;

    @PostMapping("/checkout")
    public ApiResponse<MoMoCreatePaymentResponse> checkout(@Valid @RequestBody MoMoCreatePaymentRequest request) {
        return ApiResponse.<MoMoCreatePaymentResponse>builder()
                .body(moMoPaymentService.createPayment(request))
                .build();
    }

    @PostMapping("/ipn")
    public ApiResponse<MoMoIpnResponse> ipn(@Valid @RequestBody MoMoIpnRequest request) {
        return ApiResponse.<MoMoIpnResponse>builder()
                .body(moMoPaymentService.handleIpn(request))
                .build();
    }

    @GetMapping("/{paymentId}/status")
    public ApiResponse<PaymentStatusResponse> status(@PathVariable Long paymentId) {
        return ApiResponse.<PaymentStatusResponse>builder()
                .body(moMoPaymentService.getPaymentStatus(paymentId))
                .build();
    }
}
