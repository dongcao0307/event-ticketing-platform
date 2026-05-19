package fit.iuh.payment_service.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "payment_methods")
public class PaymentMethod {

    @Id
    @Column(nullable = false, length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String displayName;

    @Column(nullable = true, length = 500)
    private String logoUrl;

    @Column(nullable = false)
    private Boolean isAvailable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProcessorType processorType;

    @ElementCollection
    @CollectionTable(name = "payment_method_config_params", joinColumns = @JoinColumn(name = "payment_method_id"))
    @MapKeyColumn(name = "config_key", length = 100)
    @Column(name = "config_value", length = 500)
    private Map<String, String> configParams;
}
