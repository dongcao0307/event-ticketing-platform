package fit.iuh.voucher_service.controller;

import fit.iuh.voucher_service.dto.request.VoucherRequestDTO;
import fit.iuh.voucher_service.entity.Voucher;
import fit.iuh.voucher_service.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/vouchers")
@RequiredArgsConstructor
public class OrganizerVoucherController {

    private final VoucherService voucherService;

    // API: Tạo mới Voucher
    // @PreAuthorize("hasRole('ORGANIZER')") -> Sẽ mở ra khi cấu hình xong Auth
    @PostMapping
    public ResponseEntity<Voucher> createVoucher(@Valid @RequestBody VoucherRequestDTO dto) {
        Voucher createdVoucher = voucherService.createVoucher(dto);
        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
    }

    // API: Lấy danh sách Voucher của tôi
    @GetMapping
    public ResponseEntity<List<Voucher>> getMyVouchers() {
        return ResponseEntity.ok(voucherService.getMyVouchers());
    }

    // API: Cập nhật Voucher
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @Valid @RequestBody VoucherRequestDTO dto) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, dto));
    }

    // API: Xóa mềm Voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok("Xóa voucher thành công (Soft Delete)");
    }
}