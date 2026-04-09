package fit.iuh.voucher_service.service;
import fit.iuh.voucher_service.dto.request.VoucherRequestDTO;
import fit.iuh.voucher_service.entity.Voucher;
import fit.iuh.voucher_service.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

    // Lấy ID của Organizer đang đăng nhập (Giả lập lấy từ JWT Token)
    private Long getCurrentOrganizerId() {
        return 1L; // Thực tế sẽ parse từ SecurityContext
    }

    // 1. THÊM VOUCHER
    @Transactional
    public Voucher createVoucher(VoucherRequestDTO dto) {
        if (voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Mã voucher đã tồn tại!");
        }
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Voucher voucher = Voucher.builder()
                .code(dto.getCode())
                .campaignName(dto.getCampaignName())
                .discountValue(dto.getDiscountValue())
                .discountType(dto.getDiscountType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .organizerId(getCurrentOrganizerId())
                .isActive(true) // Mặc định là Active khi tạo mới
                .build();

        return voucherRepository.save(voucher);
    }

    // 2. CẬP NHẬT VOUCHER
    @Transactional
    public Voucher updateVoucher(Long id, VoucherRequestDTO dto) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Voucher"));

        // Chỉ cho phép update nếu voucher thuộc về Organizer này
        if (!voucher.getOrganizerId().equals(getCurrentOrganizerId())) {
            throw new RuntimeException("Bạn không có quyền sửa voucher này");
        }

        voucher.setCampaignName(dto.getCampaignName());
        voucher.setDiscountValue(dto.getDiscountValue());
        voucher.setStartDate(dto.getStartDate());
        voucher.setEndDate(dto.getEndDate());

        return voucherRepository.save(voucher);
    }

    // 3. XÓA MỀM VOUCHER (Soft Delete)
    @Transactional
    public void deleteVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Voucher"));

        if (!voucher.getOrganizerId().equals(getCurrentOrganizerId())) {
            throw new RuntimeException("Bạn không có quyền xóa voucher này");
        }

        // Thay vì repository.delete(voucher), ta chỉ đổi cờ isActive
        voucher.setIsActive(false);
        voucherRepository.save(voucher);
    }

    // 4. LẤY DANH SÁCH VOUCHER CỦA ORGANIZER
    public List<Voucher> getMyVouchers() {
        return voucherRepository.findByOrganizerIdAndIsActiveTrue(getCurrentOrganizerId());
    }
}