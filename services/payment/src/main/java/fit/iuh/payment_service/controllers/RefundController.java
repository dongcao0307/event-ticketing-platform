package fit.iuh.payment_service.controllers;

import fit.iuh.payment_service.dtos.ApiResponse;
import fit.iuh.payment_service.dtos.requests.RefundCreateRequest;
import fit.iuh.payment_service.dtos.responses.RefundResponse;
import fit.iuh.payment_service.services.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ApiResponse<RefundResponse> requestRefund(@Valid @RequestBody RefundCreateRequest request) {
        RefundResponse resp = refundService.createRefund(request);
        return ApiResponse.<RefundResponse>builder().body(resp).build();
    }

    @GetMapping("/{refundRequestId}")
    public ApiResponse<RefundResponse> getRefund(@PathVariable String refundRequestId) {
        RefundResponse resp = refundService.getRefundById(refundRequestId);
        return ApiResponse.<RefundResponse>builder().body(resp).build();
    }
}
