package fit.iuh.voucher_service.repository;

import fit.iuh.voucher_service.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    // Tìm mã voucher hợp lệ (chưa bị xóa mềm)
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);

    // Lấy danh sách voucher của một Organizer (chưa bị xóa)
    List<Voucher> findByOrganizerIdAndIsActiveTrue(Long organizerId);

    // Kiểm tra xem mã code đã tồn tại chưa
    boolean existsByCode(String code);
}