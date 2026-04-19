package fit.iuh.payment_service.providers.vnpay.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayCreatePaymentRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayIpnRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayCreatePaymentResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayGatewayIpnResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayIpnResponse;
import fit.iuh.payment_service.providers.vnpay.services.VnPayPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment/vnpay")
@RequiredArgsConstructor
public class VnPayPaymentController {
    private final VnPayPaymentService vnPayPaymentService;

    @PostMapping("/checkout")
    public ApiResponse<VnPayCreatePaymentResponse> checkout(@Valid @RequestBody VnPayCreatePaymentRequest request) {
        return ApiResponse.<VnPayCreatePaymentResponse>builder()
                .body(vnPayPaymentService.createPayment(request))
                .build();
    }

    @PostMapping("/ipn")
    public ApiResponse<VnPayIpnResponse> ipn(@Valid @RequestBody VnPayIpnRequest request) {
        return ApiResponse.<VnPayIpnResponse>builder()
                .body(vnPayPaymentService.handleIpn(request))
                .build();
    }

    @GetMapping("/ipn/callback")
    public ResponseEntity<VnPayGatewayIpnResponse> gatewayIpn(@RequestParam Map<String, String> queryParams) {
        return ResponseEntity.ok(vnPayPaymentService.handleGatewayIpn(queryParams));
    }

    @GetMapping("/{paymentId}/status")
    public ApiResponse<PaymentStatusResponse> status(@PathVariable Long paymentId) {
        return ApiResponse.<PaymentStatusResponse>builder()
                .body(vnPayPaymentService.getPaymentStatus(paymentId))
                .build();
    }
}