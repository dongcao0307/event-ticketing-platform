package fit.iuh.ai_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NerResponse {
    private String category;
    private String city;
    private String cleanedKeyword;
    private Long maxPrice;
}
