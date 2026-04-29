package fit.iuh.event_service.configs;

import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final EventRepository eventRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (eventRepository.count() > 0) {
                log.info("Data already initialized, skipping.");
                return;
            }

            log.info("Initializing sample events...");

            eventRepository.save(Event.builder()
                    .title("The Traditional Water Puppet Show")
                    .description("Biểu diễn múa rối nước truyền thống Việt Nam với các tiết mục đặc sắc, kể những câu chuyện dân gian lịch sử hàng trăm năm.")
                    .imageUrl("https://images.unsplash.com/photo-1519730901064-18ed6fdf2cd4?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.THEATER)
                    .categoryId(1L)
                    .location("Nhà hát Múa rối Thăng Long")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 4, 20, 19, 30))
                    .endTime(LocalDateTime.of(2026, 4, 20, 21, 0))
                    .minPrice(new BigDecimal("350000"))
                    .maxPrice(new BigDecimal("600000"))
                    .totalTickets(500)
                    .availableTickets(320)
                    .status(EventStatus.DRAFT)
                    .organizerName("Nhà hát Múa rối Thăng Long")
                    .organizerId(1L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(1250)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Crossroads - The Untold Stories")
                    .description("Đêm nhạc đầy cảm xúc kể những câu chuyện chưa được kể - hành trình âm nhạc qua nhiều thập kỷ.")
                    .imageUrl("https://images.unsplash.com/photo-1495121605193-b116b5b09bf5?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Nhà hát Hòa Bình")
                    .city("TP. Hồ Chí Minh")
                    .startTime(LocalDateTime.of(2026, 4, 21, 20, 0))
                    .endTime(LocalDateTime.of(2026, 4, 21, 22, 30))
                    .minPrice(new BigDecimal("575000"))
                    .maxPrice(new BigDecimal("1200000"))
                    .totalTickets(1200)
                    .availableTickets(890)
                    .status(EventStatus.DRAFT)
                    .organizerName("Live Nation Vietnam")
                    .organizerId(2L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(3400)
                    .build());

            eventRepository.save(Event.builder()
                    .title("ĐÊM THÁNH - Đêm nhạc Trung Quân")
                    .description("Đêm nhạc acoustic đặc biệt của Trung Quân với những ca khúc ballad đầy cảm xúc. Một đêm nhạc không thể quên.")
                    .imageUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Trung tâm Hội nghị Quốc gia")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 4, 23, 19, 0))
                    .endTime(LocalDateTime.of(2026, 4, 23, 22, 0))
                    .minPrice(new BigDecimal("700000"))
                    .maxPrice(new BigDecimal("1500000"))
                    .totalTickets(3000)
                    .availableTickets(1200)
                    .status(EventStatus.DRAFT)
                    .organizerName("WeChoice Entertainment")
                    .organizerId(3L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(5600)
                    .build());

            eventRepository.save(Event.builder()
                    .title("ĐÊM THÁNH - Đêm nhạc Hoàng Quyên")
                    .description("Đêm nhạc đặc biệt của Hoàng Quyên với chủ đề 'Tình ca bất diệt' - hành trình qua những bản nhạc vàng.")
                    .imageUrl("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Nhà Văn hóa Thanh Niên")
                    .city("TP. Hồ Chí Minh")
                    .startTime(LocalDateTime.of(2026, 4, 24, 19, 30))
                    .endTime(LocalDateTime.of(2026, 4, 24, 22, 0))
                    .minPrice(new BigDecimal("500000"))
                    .maxPrice(new BigDecimal("1000000"))
                    .totalTickets(800)
                    .availableTickets(450)
                    .status(EventStatus.DRAFT)
                    .organizerName("Đông Tây Promotion")
                    .organizerId(4L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(2100)
                    .build());

            eventRepository.save(Event.builder()
                    .title("ARGU - Live in Vietnam 2026")
                    .description("Lần đầu tiên ARGU biểu diễn tại Việt Nam! Đừng bỏ lỡ đêm nhạc EDM đỉnh cao này.")
                    .imageUrl("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("SVĐ Mỹ Đình")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 4, 24, 20, 0))
                    .endTime(LocalDateTime.of(2026, 4, 25, 1, 0))
                    .minPrice(new BigDecimal("999000"))
                    .maxPrice(new BigDecimal("3000000"))
                    .totalTickets(10000)
                    .availableTickets(7500)
                    .status(EventStatus.DRAFT)
                    .organizerName("Epix Entertainment")
                    .organizerId(5L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(8900)
                    .build());

            eventRepository.save(Event.builder()
                    .title("DEMO MUSIC - ENA Concert")
                    .description("ENA ra mắt album mới với tour diễn khắp Việt Nam. Đừng bỏ lỡ màn trình diễn đặc biệt này.")
                    .imageUrl("https://images.unsplash.com/photo-1512080872261-9d5e778ed2fb?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Nhà hát Lớn Hà Nội")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 5, 1, 19, 30))
                    .endTime(LocalDateTime.of(2026, 5, 1, 21, 30))
                    .minPrice(new BigDecimal("250000"))
                    .maxPrice(new BigDecimal("500000"))
                    .totalTickets(600)
                    .availableTickets(380)
                    .status(EventStatus.DRAFT)
                    .organizerName("Demo Music")
                    .organizerId(6L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(1400)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Kịch Xóm - Mùa 3")
                    .description("Sân khấu kịch dân gian đương đại với những câu chuyện hài hước, gần gũi và đầy ý nghĩa về cuộc sống.")
                    .imageUrl("https://images.unsplash.com/photo-1527060397950-31b8f0b6fe03?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.THEATER)
                    .categoryId(1L)
                    .location("Sân khấu IDECAF")
                    .city("TP. Hồ Chí Minh")
                    .startTime(LocalDateTime.of(2026, 5, 5, 19, 30))
                    .endTime(LocalDateTime.of(2026, 5, 5, 21, 0))
                    .minPrice(new BigDecimal("200000"))
                    .maxPrice(new BigDecimal("400000"))
                    .totalTickets(350)
                    .availableTickets(200)
                    .status(EventStatus.DRAFT)
                    .organizerName("IDECAF")
                    .organizerId(7L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(900)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Workshop Terrarium & Candle Making")
                    .description("Học làm terrarium và nến thơm handmade cùng các chuyên gia. Thích hợp cho mọi lứa tuổi, không cần kinh nghiệm.")
                    .imageUrl("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.WORKSHOP)
                    .categoryId(4L)
                    .location("The Garden Workshop")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 5, 8, 14, 0))
                    .endTime(LocalDateTime.of(2026, 5, 8, 17, 0))
                    .minPrice(new BigDecimal("420000"))
                    .maxPrice(new BigDecimal("420000"))
                    .totalTickets(30)
                    .availableTickets(12)
                    .status(EventStatus.DRAFT)
                    .organizerName("The Garden Workshop")
                    .organizerId(8L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(560)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Concert Jazz Night Đà Nẵng")
                    .description("Đêm nhạc Jazz thính phòng với sự tham gia của các nghệ sĩ quốc tế. Không gian sang trọng, âm nhạc đẳng cấp.")
                    .imageUrl("https://images.unsplash.com/photo-1513283487479-d8d9c1c0b7c1?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Aria Hotel & Spa")
                    .city("Đà Nẵng")
                    .startTime(LocalDateTime.of(2026, 5, 12, 20, 0))
                    .endTime(LocalDateTime.of(2026, 5, 12, 22, 30))
                    .minPrice(new BigDecimal("350000"))
                    .maxPrice(new BigDecimal("800000"))
                    .totalTickets(200)
                    .availableTickets(130)
                    .status(EventStatus.DRAFT)
                    .organizerName("Da Nang Jazz Club")
                    .organizerId(9L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(780)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Lễ hội Ánh sáng Hà Nội 2026")
                    .description("Lễ hội ánh sáng nghệ thuật lần đầu tiên được tổ chức tại Hà Nội với hàng nghìn màn trình diễn ánh sáng độc đáo.")
                    .imageUrl("https://images.unsplash.com/photo-1453974336165-b28f7a47d14d?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.FESTIVAL)
                    .categoryId(5L)
                    .location("Công viên Thống Nhất")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 5, 15, 18, 0))
                    .endTime(LocalDateTime.of(2026, 5, 20, 22, 0))
                    .minPrice(new BigDecimal("180000"))
                    .maxPrice(new BigDecimal("350000"))
                    .totalTickets(5000)
                    .availableTickets(3200)
                    .status(EventStatus.DRAFT)
                    .organizerName("Hà Nội Tourism")
                    .organizerId(10L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(4200)
                    .build());

            eventRepository.save(Event.builder()
                    .title("ĐÀO HOA HẬU - Live Show")
                    .description("Live show hài kịch đặc biệt của danh hài Đào Hoa Hậu với chương trình mới hoàn toàn. Cười không ngừng!")
                    .imageUrl("https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.COMEDY)
                    .categoryId(6L)
                    .location("Nhà hát Bến Thành")
                    .city("TP. Hồ Chí Minh")
                    .startTime(LocalDateTime.of(2026, 5, 15, 19, 30))
                    .endTime(LocalDateTime.of(2026, 5, 15, 21, 0))
                    .minPrice(new BigDecimal("350000"))
                    .maxPrice(new BigDecimal("600000"))
                    .totalTickets(600)
                    .availableTickets(420)
                    .status(EventStatus.DRAFT)
                    .organizerName("Comedy Club VN")
                    .organizerId(11L) // <--- Đã bổ sung
                    .isFeatured(false)
                    .viewCount(1800)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Mr. Siro Concert 2026")
                    .description("Đêm nhạc live lớn nhất trong sự nghiệp của Mr. Siro. 3 tiếng đồng hồ với hàng trăm ca khúc hit.")
                    .imageUrl("https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80")
                    .category(EventCategory.MUSIC)
                    .categoryId(2L)
                    .location("Cung Thể thao Quần Ngựa")
                    .city("Hà Nội")
                    .startTime(LocalDateTime.of(2026, 5, 28, 19, 0))
                    .endTime(LocalDateTime.of(2026, 5, 28, 22, 30))
                    .minPrice(new BigDecimal("450000"))
                    .maxPrice(new BigDecimal("1200000"))
                    .totalTickets(5000)
                    .availableTickets(3100)
                    .status(EventStatus.DRAFT)
                    .organizerName("Mr. Siro Entertainment")
                    .organizerId(12L) // <--- Đã bổ sung
                    .isFeatured(true)
                    .viewCount(7200)
                    .build());

            log.info("Sample events initialized successfully!");
        };
    }
}