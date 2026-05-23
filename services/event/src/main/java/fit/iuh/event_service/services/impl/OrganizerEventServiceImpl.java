package fit.iuh.event_service.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.dtos.EventReq;
import fit.iuh.event_service.dtos.EventSummaryResponse;
import fit.iuh.event_service.dtos.FullEventCreateRequest;
import fit.iuh.event_service.dtos.PerformanceReq;
import fit.iuh.event_service.models.*;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.models.enums.PerformanceStatus;
import fit.iuh.event_service.repositories.*;
import fit.iuh.event_service.services.OrganizerEventService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizerEventServiceImpl implements OrganizerEventService {

    private final EventRepository eventRepository;
    private final EventPerformanceRepository performanceRepository;
    private final VenueRepository venueRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final OrganizerPaymentInfoRepository organizerPaymentInfoRepository;
    private final ObjectMapper objectMapper;

    @Override
    public Event createEvent(Long organizerId, EventReq req) {
        Event event = Event.builder()
                .organizerId(organizerId)
                .title(req.getTitle())
                .thumbnailUrl(req.getThumbnailUrl())
                .posterUrl(req.getPosterUrl())
                .description(req.getDescription())
                .categoryId(req.getCategoryId())
                .status(EventStatus.DRAFT) // Mặc định là Nháp khi mới tạo
                .build();
        return eventRepository.save(event);
        // Note: No cache annotation needed for CREATE - cache is populated on first READ
    }

    @Override
    @Transactional // 🚀 Cực kỳ quan trọng: Đảm bảo xóa cũ - thêm mới không bị lỗi kẹt dữ liệu
    @CachePut(value = "events", key = "#eventId")
    public Event updateEvent(Long organizerId, Long eventId, EventReq req) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Bạn không có quyền sửa sự kiện này");
        }

        // ==========================================
        // 1. CẬP NHẬT THÔNG TIN SỰ KIỆN CƠ BẢN
        // ==========================================
        event.setTitle(req.getTitle());
        event.setThumbnailUrl(req.getThumbnailUrl());
        event.setPosterUrl(req.getPosterUrl());
        event.setDescription(req.getDescription());
        event.setCategoryId(req.getCategoryId());
        event.setOrganizerName(req.getOrganizerName());
        event.setOrganizerLogo(req.getOrganizerLogo());
        event.setOrganizerInfo(req.getOrganizerInfo());

        Event savedEvent = eventRepository.save(event);

        // ĐƯA BIẾN NÀY RA NGOÀI ĐỂ TRÁNH LỖI SCOPE (Cannot resolve symbol)
        Venue savedVenue = null;

        // ==========================================
        // 2. CẬP NHẬT SUẤT DIỄN, ĐỊA ĐIỂM VÀ VÉ
        // ==========================================
        if (req.getPerformances() != null && !req.getPerformances().isEmpty()) {

            // DỌN SẠCH DỮ LIỆU CŨ TRONG DATABASE
            List<EventPerformance> oldPerformances = performanceRepository.findByEventId(eventId);
            for (EventPerformance oldPerf : oldPerformances) {
                if (oldPerf.getTickets() != null && !oldPerf.getTickets().isEmpty()) {
                    ticketTypeRepository.deleteAll(oldPerf.getTickets());
                }
            }
            performanceRepository.deleteAll(oldPerformances);
            savedEvent.setPerformances(new ArrayList<>());
            performanceRepository.flush();

            // TẠO LẠI ĐỊA ĐIỂM
            if (req.getVenueName() != null && !req.getVenueName().trim().isEmpty()) {
                Venue venue = new Venue();
                venue.setName(req.getVenueName());
                venue.setCity(req.getProvince());

                String combinedAddress = String.format("%s, %s, %s",
                        req.getStreet() != null ? req.getStreet() : "",
                        req.getWard() != null ? req.getWard() : "",
                        req.getDistrict() != null ? req.getDistrict() : "");
                combinedAddress = combinedAddress.replaceAll("^, |, $", "").replaceAll(", ,", ",");
                venue.setAddress(combinedAddress);

                savedVenue = venueRepository.save(venue);
            }

            // LƯU LẠI TOÀN BỘ SUẤT DIỄN VÀ VÉ MỚI
            for (FullEventCreateRequest.PerformanceRequest perfReq : req.getPerformances()) {
                EventPerformance perf = new EventPerformance();
                perf.setEvent(savedEvent);

                if (savedVenue != null) {
                    perf.setVenue(savedVenue);
                }
                perf.setStatus(PerformanceStatus.OPEN);

                if (perfReq.getStartTime() != null) perf.setStartTime(perfReq.getStartTime());
                if (perfReq.getEndTime() != null) perf.setEndTime(perfReq.getEndTime());

                int totalCapacity = 0;
                if (perfReq.getTickets() != null) {
                    totalCapacity = perfReq.getTickets().stream()
                            .mapToInt(t -> t.getTotalQuantity() != null ? t.getTotalQuantity() : 0)
                            .sum();
                }
                perf.setTotalCapacity(totalCapacity);
                perf.setAvailableCapacity(totalCapacity);

                EventPerformance savedPerf = performanceRepository.save(perf);

                if (perfReq.getTickets() != null) {
                    List<TicketType> ticketTypes = new ArrayList<>();
                    for (FullEventCreateRequest.TicketRequest ticketReq : perfReq.getTickets()) {
                        TicketType ticketType = new TicketType();
                        ticketType.setPerformanceId(savedPerf.getId());
                        ticketType.setName(ticketReq.getName());
                        ticketType.setPrice(ticketReq.isFree() ? java.math.BigDecimal.ZERO : ticketReq.getPrice());

                        ticketType.setTotalQuantity(ticketReq.getTotalQuantity());
                        ticketType.setMaxTicketsPerUser(ticketReq.getMaxTicketsPerUser() != null ? ticketReq.getMaxTicketsPerUser() : 10);
                        ticketType.setMinTicketsPerUser(ticketReq.getMinTicketsPerUser() != null ? ticketReq.getMinTicketsPerUser() : 1);
                        ticketType.setSoldQuantity(0);
                        ticketType.setReservedQuantity(0);
                        ticketType.setSaleStart(ticketReq.getSaleStart());
                        ticketType.setSaleEnd(ticketReq.getSaleEnd());

                        ticketTypes.add(ticketType);
                    }
                    ticketTypeRepository.saveAll(ticketTypes);
                }
            }
        }

        // ==========================================
        // 3. CẬP NHẬT NGƯỢC LẠI THỐNG KÊ LÊN EVENT KHI CHỈNH SỬA
        // ==========================================
        if (savedVenue != null) {
            savedEvent.setLocation(savedVenue.getName());
            savedEvent.setCity(savedVenue.getCity());
        }

        int totalEventTickets = 0;
        java.math.BigDecimal minPrice = null;
        java.math.BigDecimal maxPrice = null;
        LocalDateTime eventStartTime = null;
        LocalDateTime eventEndTime = null;

        if (req.getPerformances() != null) {
            for (FullEventCreateRequest.PerformanceRequest perfReq : req.getPerformances()) {
                if (perfReq.getStartTime() != null) {
                    if (eventStartTime == null || perfReq.getStartTime().isBefore(eventStartTime)) {
                        eventStartTime = perfReq.getStartTime();
                    }
                }
                if (perfReq.getEndTime() != null) {
                    if (eventEndTime == null || perfReq.getEndTime().isAfter(eventEndTime)) {
                        eventEndTime = perfReq.getEndTime();
                    }
                }

                if (perfReq.getTickets() != null) {
                    for (FullEventCreateRequest.TicketRequest tReq : perfReq.getTickets()) {
                        totalEventTickets += (tReq.getTotalQuantity() != null ? tReq.getTotalQuantity() : 0);

                        java.math.BigDecimal price = tReq.isFree() ? java.math.BigDecimal.ZERO : tReq.getPrice();
                        if (price != null) {
                            if (minPrice == null || price.compareTo(minPrice) < 0) minPrice = price;
                            if (maxPrice == null || price.compareTo(maxPrice) > 0) maxPrice = price;
                        }
                    }
                }
            }
        }

        savedEvent.setTotalTickets(totalEventTickets);
        savedEvent.setAvailableTickets(totalEventTickets);
        savedEvent.setMinPrice(minPrice);
        savedEvent.setMaxPrice(maxPrice);
        savedEvent.setStartTime(eventStartTime);
        savedEvent.setEndTime(eventEndTime);
        savedEvent.setUpdatedAt(LocalDateTime.now());

        return eventRepository.save(savedEvent);
    }

//    @Override
//    public List<Event> getMyEvents(Long organizerId, String keyword) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            return eventRepository.findByOrganizerId(organizerId);
//        }
//        return eventRepository.findByOrganizerIdAndTitleContainingIgnoreCase(organizerId, keyword);
//    }
    @Override
    public EventPerformance createPerformance(Long organizerId, Long eventId, PerformanceReq req) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Bạn không có quyền tạo suất diễn cho sự kiện này");
        }

        Venue venue = venueRepository.findById(req.getVenueId())
                .orElseThrow(() -> new RuntimeException("Địa điểm không tồn tại"));

        EventPerformance performance = EventPerformance.builder()
                .event(event)
                .venue(venue)
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .totalCapacity(req.getTotalCapacity())
                .availableCapacity(req.getTotalCapacity()) // Mới tạo thì số vé trống = tổng vé
                .status(PerformanceStatus.OPEN) // Mở bán
                .build();

        return performanceRepository.save(performance);
    }

    @Override
    @Transactional(readOnly = true) // Cực kỳ quan trọng để giữ Session sống cho đến khi xong việc
    public Event getEventById(Long organizerId, Long eventId) {
        // Dùng hàm findFullEventById vừa tạo
        Event event = eventRepository.findFullEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Bạn không có quyền xem sự kiện này");
        }
        return event;
    }

    @Override
    @CacheEvict(value = "events", key = "#eventId", beforeInvocation = false)
    // beforeInvocation = false: Cache is evicted AFTER deletion succeeds
    // This ensures the deletion is confirmed before removing from cache
    public void deleteEvent(Long organizerId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        // Bảo mật: Chỉ người tạo mới được quyền xóa
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Bạn không có quyền xóa sự kiện này");
        }

        eventRepository.delete(event);
    }

    @Override
    public List<EventPerformance> getPerformancesByEventId(Long organizerId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        // Bảo mật: Kiểm tra quyền sở hữu sự kiện
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Bạn không có quyền xem suất diễn của sự kiện này");
        }

        return performanceRepository.findByEventId(eventId);
    }

    @Override
    @Transactional // 🚀 Đảm bảo nếu lỗi ở bất kỳ bước nào, toàn bộ dữ liệu sẽ không bị lưu (All-or-Nothing)
    public Event createFullEvent(Long organizerId, FullEventCreateRequest request) {

        // ==========================================
        // 1. LƯU THÔNG TIN SỰ KIỆN & SETTINGS (Step 1 & 3)
        // ==========================================
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategoryId(request.getCategoryId());
        event.setThumbnailUrl(request.getThumbnailUrl());
        event.setPosterUrl(request.getPosterUrl());
        event.setOrganizerId(organizerId);
        event.setStatus(EventStatus.PENDING);
        event.setCreatedAt(LocalDateTime.now());

        // ---> THÊM 3 DÒNG NÀY ĐỂ LƯU BAN TỔ CHỨC <---
        event.setOrganizerName(request.getOrganizerName());
        event.setOrganizerLogo(request.getOrganizerLogo());
        event.setOrganizerInfo(request.getOrganizerInfo());
        // --------------------------------------------

        // Chuyển Object Settings thành JSON để lưu vào cột settingsConfig (Step 3)
        if (request.getSettings() != null) {
            try {
                event.setSettingsConfig(objectMapper.writeValueAsString(request.getSettings()));
            } catch (Exception e) {
                throw new RuntimeException("Lỗi xử lý JSON Settings: " + e.getMessage());
            }
        }

        Event savedEvent = eventRepository.save(event);

        // ==========================================
        // 2. LƯU THÔNG TIN ĐỊA ĐIỂM (VENUE)
        // ==========================================
        Venue savedVenue = null;
        if (request.getVenueName() != null && !request.getVenueName().trim().isEmpty()) {
            Venue venue = new Venue();
            venue.setName(request.getVenueName());

            // 1. Lưu Tỉnh/Thành vào trường city
            venue.setCity(request.getProvince());

            // 2. Gộp Số nhà, Phường, Quận thành một chuỗi rồi lưu vào trường address
            // Kết quả ví dụ: "Số 12, Phường Phúc Xá, Quận Ba Đình"
            String combinedAddress = String.format("%s, %s, %s",
                    request.getStreet(),
                    request.getWard(),
                    request.getDistrict());
            venue.setAddress(combinedAddress);

            savedVenue = venueRepository.save(venue);
        }

        // ==========================================
        // 3. LƯU DANH SÁCH SUẤT DIỄN & VÉ (Step 2)
        // ==========================================
        if (request.getPerformances() != null && !request.getPerformances().isEmpty()) {
            for (FullEventCreateRequest.PerformanceRequest perfReq : request.getPerformances()) {
                EventPerformance perf = new EventPerformance();
                perf.setEvent(savedEvent); // Theo UML liên kết đối tượng
                if (savedVenue != null) {
                    perf.setVenue(savedVenue);
                }
                perf.setStatus(PerformanceStatus.OPEN);

                // Xử lý an toàn thời gian gửi từ Frontend (Chống chuỗi rỗng)
                if (perfReq.getStartTime() != null) {
                    perf.setStartTime(perfReq.getStartTime());
                }
                if (perfReq.getEndTime() != null) {
                    perf.setEndTime(perfReq.getEndTime());
                }

                // Tự động tính tổng sức chứa (totalCapacity) dựa trên tổng số lượng vé
                int totalCapacity = 0;
                if (perfReq.getTickets() != null) {
                    totalCapacity = perfReq.getTickets().stream()
                            .mapToInt(t -> t.getTotalQuantity() != null ? t.getTotalQuantity() : 0)
                            .sum();
                }
                perf.setTotalCapacity(totalCapacity);
                perf.setAvailableCapacity(totalCapacity);

                // Lưu suất diễn
                EventPerformance savedPerf = performanceRepository.save(perf);

                // Lưu các loại vé (TicketType) cho suất diễn này
                if (perfReq.getTickets() != null) {
                    List<TicketType> ticketTypes = new ArrayList<>();
                    for (FullEventCreateRequest.TicketRequest ticketReq : perfReq.getTickets()) {
                        TicketType ticketType = new TicketType();
                        ticketType.setPerformanceId(savedPerf.getId()); // Liên kết ID suất diễn
                        ticketType.setName(ticketReq.getName());

                        // Xử lý giá vé: Nếu tick Free thì để 0, ngược lại lấy giá BigDecimal
                        ticketType.setPrice(ticketReq.isFree() ? java.math.BigDecimal.ZERO : ticketReq.getPrice());

                        ticketType.setMaxTicketsPerUser(ticketReq.getMaxTicketsPerUser() != null ? ticketReq.getMaxTicketsPerUser() : 10);
                        ticketType.setMinTicketsPerUser(ticketReq.getMinTicketsPerUser() != null ? ticketReq.getMinTicketsPerUser() : 1);
                        ticketType.setTotalQuantity(ticketReq.getTotalQuantity());
                        ticketType.setSoldQuantity(0);
                        ticketType.setReservedQuantity(0);
                        ticketType.setSaleStart(ticketReq.getSaleStart());
                        ticketType.setSaleEnd(ticketReq.getSaleEnd());

                        ticketTypes.add(ticketType);
                    }
                    ticketTypeRepository.saveAll(ticketTypes);
                }
            }
        }

        // ==========================================
        // 4. LƯU THÔNG TIN THANH TOÁN (Step 4)
        // ==========================================
        if (request.getPaymentInfo() != null) {
            OrganizerPaymentInfo payment = new OrganizerPaymentInfo();
            payment.setEvent(savedEvent);

            // Map dữ liệu từ DTO sang Entity (Theo UML của bạn)
            payment.setAccountOwner(request.getPaymentInfo().getAccountName());
            payment.setAccountNumber(request.getPaymentInfo().getAccountNumber());
            payment.setBankName(request.getPaymentInfo().getBankName());
            payment.setBankBranch(request.getPaymentInfo().getBranch());
            payment.setTaxCode(request.getPaymentInfo().getTaxCode());
            payment.setAddress(request.getPaymentInfo().getAddress());

            organizerPaymentInfoRepository.save(payment);
        }

        // ==========================================
        // 5. CẬP NHẬT NGƯỢC THỐNG KÊ LÊN BẢNG SỰ KIỆN (Tránh Null)
        // ==========================================
        if (savedVenue != null) {
            savedEvent.setLocation(savedVenue.getName());
            savedEvent.setCity(savedVenue.getCity());
        }

        int totalEventTickets = 0;
        java.math.BigDecimal minPrice = null;
        java.math.BigDecimal maxPrice = null;
        LocalDateTime eventStartTime = null;
        LocalDateTime eventEndTime = null;

        if (request.getPerformances() != null) {
            for (FullEventCreateRequest.PerformanceRequest perfReq : request.getPerformances()) {
                // Tính ngày bắt đầu sớm nhất và kết thúc muộn nhất
                if (perfReq.getStartTime() != null) {
                    if (eventStartTime == null || perfReq.getStartTime().isBefore(eventStartTime)) {
                        eventStartTime = perfReq.getStartTime();
                    }
                }
                if (perfReq.getEndTime() != null) {
                    if (eventEndTime == null || perfReq.getEndTime().isAfter(eventEndTime)) {
                        eventEndTime = perfReq.getEndTime();
                    }
                }

                // Cộng dồn vé và tìm giá Min/Max
                if (perfReq.getTickets() != null) {
                    for (FullEventCreateRequest.TicketRequest tReq : perfReq.getTickets()) {
                        totalEventTickets += (tReq.getTotalQuantity() != null ? tReq.getTotalQuantity() : 0);

                        java.math.BigDecimal price = tReq.isFree() ? java.math.BigDecimal.ZERO : tReq.getPrice();
                        if (price != null) {
                            if (minPrice == null || price.compareTo(minPrice) < 0) minPrice = price;
                            if (maxPrice == null || price.compareTo(maxPrice) > 0) maxPrice = price;
                        }
                    }
                }
            }
        }

        // Gắn số liệu vào Event
        savedEvent.setTotalTickets(totalEventTickets);
        savedEvent.setAvailableTickets(totalEventTickets); // Mới tạo thì vé trống = tổng vé
        savedEvent.setMinPrice(minPrice);
        savedEvent.setMaxPrice(maxPrice);
        savedEvent.setStartTime(eventStartTime);
        savedEvent.setEndTime(eventEndTime);

        // Lưu bản cập nhật cuối cùng xuống DB
        eventRepository.save(savedEvent);

        return savedEvent;
    }

    @Override
    public List<EventSummaryResponse> getEventsByOrganizerId(Long organizerId, String keyword) {
        List<Event> events = (keyword != null && !keyword.trim().isEmpty())
                ? eventRepository.findByOrganizerIdAndTitleContainingIgnoreCase(organizerId, keyword)
                : eventRepository.findByOrganizerId(organizerId);

        List<EventSummaryResponse> responses = new ArrayList<>();

        for (Event event : events) {
            EventSummaryResponse res = new EventSummaryResponse();
            res.setId(event.getId());
            res.setTitle(event.getTitle());
            res.setThumbnailUrl(event.getThumbnailUrl());
            res.setCreatedAt(event.getCreatedAt());
            res.setStatus(event.getStatus());
            res.setOrganizerName(event.getOrganizerName());
            res.setOrganizerLogo(event.getOrganizerLogo());
            res.setOrganizerInfo(event.getOrganizerInfo());
            res.setMinPrice(event.getMinPrice());
            res.setMaxPrice(event.getMaxPrice());
            res.setStartTime(event.getStartTime());
            res.setEndTime(event.getEndTime());
            res.setTotalTickets(event.getTotalTickets());
            res.setAvailableTickets(event.getAvailableTickets());

            // Đảm bảo dữ liệu được lấy an toàn
            try {
                // Nếu Event đã có performances (do fetch ở repo), dùng luôn, không cần gọi repo nữa
                List<EventPerformance> performances = event.getPerformances();
                if (performances != null && !performances.isEmpty() && performances.get(0).getVenue() != null) {
                    Venue v = performances.get(0).getVenue();
                    res.setVenueName(v.getName());
                    res.setFullAddress((v.getAddress() != null ? v.getAddress() : "") + ", " + (v.getCity() != null ? v.getCity() : ""));
                } else {
                    res.setVenueName("Chưa xác định");
                    res.setFullAddress("Đang cập nhật địa chỉ");
                }
            } catch (Exception e) {
                res.setVenueName("Chưa xác định");
                res.setFullAddress("Đang cập nhật địa chỉ");
            }
            responses.add(res);
        }
        return responses;
    }
}
