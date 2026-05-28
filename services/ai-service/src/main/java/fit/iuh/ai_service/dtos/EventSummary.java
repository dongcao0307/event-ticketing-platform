package fit.iuh.ai_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Lightweight projection of an event returned by the event-service
 * semantic search. Only carries the fields the LLM needs to compose
 * a useful answer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSummary {

    /** Primary key used to build the deep link. */
    private Long id;

    /** Human-readable event title. */
    private String title;

    /** City / location string, e.g. "Hồ Chí Minh". */
    private String city;

    /** Location / venue name. */
    private String location;

    /** ISO-8601 formatted start date-time, e.g. "2025-12-31T20:00:00". */
    private String startTime;

    /** Minimum ticket price in VND. Null means free. */
    private BigDecimal minPrice;

    /** Human-friendly price string, e.g. "Từ 250,000đ" or "Miễn phí". */
    private String priceDisplay;

    /**
     * Deep link to the event booking page.
     * Populated by AiToolConfig after receiving results from the event-service.
     */
    private String bookingUrl;
}
