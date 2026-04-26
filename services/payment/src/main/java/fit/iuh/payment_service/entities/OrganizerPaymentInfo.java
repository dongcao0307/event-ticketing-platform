package fit.iuh.payment_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "organizer_payment_infos")
public class OrganizerPaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long eventId;

    @Column(nullable = false, length = 40)
    private String accountNumber;

    @Column(nullable = false, length = 120)
    private String accountOwner;

    @Column(nullable = false, length = 120)
    private String bankName;

    @Column(nullable = true, length = 120)
    private String bankBranch;

    @Column(nullable = true, length = 50)
    private String taxCode;

    @Column(nullable = true, length = 255)
    private String address;
}
