package fit.iuh.payment_service.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.requests.PaymentCallbackRequest;
import fit.iuh.payment_service.dtos.responses.PaymentCallbackResponse;
import fit.iuh.payment_service.services.PaymentCallbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/callbacks")
@RequiredArgsConstructor
public class PaymentCallbackController {
    private final PaymentCallbackService paymentCallbackService;

    @PostMapping
    public ApiResponse<PaymentCallbackResponse> saveCallback(@Valid @RequestBody PaymentCallbackRequest request) {
        return ApiResponse.<PaymentCallbackResponse>builder()
                .body(paymentCallbackService.saveCallback(request))
                .build();
    }
}