package fit.iuh.event_service.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Nới lỏng điều kiện (bỏ nullable = false) để hỗ trợ cả sự kiện Online không có địa chỉ
    private String address;

    private String city;

    // Dùng kiểu TEXT để lưu chuỗi JSON, đảm bảo an toàn và không bị lỗi Database
    @Column(name = "seat_map_config", columnDefinition = "TEXT")
    private String seatMapConfig;
}