package fit.iuh.ai_service.dtos;

import lombok.Data;

/**
 * Lightweight input record the LLM fills out when it decides to invoke
 * the {@code searchEventTool} function.
 *
 * <p>All fields are optional so the model can invoke the tool with only the
 * information the user actually provided.
 */
@Data
public class SearchEventRequest {

    /**
     * Free-text search query, e.g. "Hà Anh Tuấn", "rock concert", "yoga".
     * The event-service NER pipeline will further clean and classify it.
     */
    private String keyword;

    /**
     * Event category filter. Allowed values (case-insensitive):
     * THEATER, MUSIC, SPORTS, WORKSHOP, FESTIVAL, COMEDY, EXHIBITION, OTHER.
     * Leave blank to search all categories.
     */
    private String category;

    /**
     * City filter, e.g. "Hồ Chí Minh", "Hà Nội", "Đà Nẵng".
     * Leave blank to search all cities.
     */
    private String city;

    /**
     * Maximum price limit in VND. Convert text descriptions like "dưới 500k" -> 500000.0,
     * "tầm 1 triệu" -> 1000000.0.
     */
    private Double maxPrice;

    /**
     * Set to true if the user specifically requests free/zero-cost events.
     */
    private Boolean isFree;

    /**
     * Start date of search window in ISO YYYY-MM-DD format.
     */
    private String startDate;

    /**
     * End date of search window in ISO YYYY-MM-DD format.
     */
    private String endDate;

    /**
     * Location/venue query, e.g. "Sân vận động Mỹ Đình", "Nhà hát lớn".
     */
    private String location;

    /**
     * Organizer query, e.g. "SpaceSpeakers", "M-TP Entertainment".
     */
    private String organizer;
}
