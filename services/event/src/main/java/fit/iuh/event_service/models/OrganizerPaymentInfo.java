package fit.iuh.event_service.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "organizer_payment_infos")
public class OrganizerPaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId; // External ID theo UML

    private String accountNumber;
    private String accountOwner;
    private String bankName;
    private String bankBranch;
    private String taxCode;
    private String address;
}
