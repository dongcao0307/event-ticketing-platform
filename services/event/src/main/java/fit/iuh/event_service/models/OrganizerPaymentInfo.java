package fit.iuh.event_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "organizer_payment_infos")
public class OrganizerPaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    private String accountNumber;
    private String accountOwner;
    private String bankName;
    private String bankBranch;
    private String taxCode;
    private String address;
}