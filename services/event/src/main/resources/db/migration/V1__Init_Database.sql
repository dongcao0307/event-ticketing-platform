-- 1. Tạo bảng Venues (Địa điểm)

CREATE TABLE venues (

                        id BIGINT AUTO_INCREMENT PRIMARY KEY,

                        name VARCHAR(255) NOT NULL,

                        address VARCHAR(255),

                        city VARCHAR(100),

                        seat_map_config TEXT

);



-- 2. Tạo bảng Events (Sự kiện)

CREATE TABLE events (

                        id BIGINT AUTO_INCREMENT PRIMARY KEY,

                        organizer_id BIGINT NOT NULL,

                        title VARCHAR(255) NOT NULL,

                        thumbnail_url VARCHAR(500),

                        poster_url VARCHAR(500),

                        description TEXT,

                        category_id BIGINT,

                        status VARCHAR(50) DEFAULT 'DRAFT',

                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



-- 3. Tạo bảng Event Performances (Suất diễn)

CREATE TABLE event_performances (

                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                    event_id BIGINT NOT NULL,

                                    venue_id BIGINT NOT NULL,

                                    start_time DATETIME NOT NULL,

                                    end_time DATETIME NOT NULL,

                                    total_capacity INT NOT NULL,

                                    available_capacity INT NOT NULL,

                                    status VARCHAR(50) DEFAULT 'OPEN',

                                    CONSTRAINT fk_performance_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,

                                    CONSTRAINT fk_performance_venue FOREIGN KEY (venue_id) REFERENCES venues(id)

);



-- =======================================================

-- MOCK DATA CHO VENUES (Địa điểm)

-- =======================================================

INSERT INTO venues (name, address, city, seat_map_config) VALUES

                                                              ('Sân Vận Động Quân Khu 7', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 'Hồ Chí Minh', '{"zones": ["VIP", "GA", "A", "B"]}'),

                                                              ('Nhà Hát Hòa Bình', '240-242 Đường 3/2, Phường 12, Quận 10', 'Hồ Chí Minh', '{"zones": ["Tầng 1", "Tầng 2", "Ban công"]}'),

                                                              ('Sân Vận Động Quốc Gia Mỹ Đình', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 'Hà Nội', '{"zones": ["Khán đài A", "Khán đài B", "Khán đài C", "Khán đài D"]}'),

                                                              ('Trung Tâm Hội Nghị Quốc Gia', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 'Hà Nội', '{"zones": ["Hội trường lớn", "Phòng VIP"]}'),

                                                              ('Gem Center', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 'Hồ Chí Minh', '{"zones": ["Sảnh Castor", "Sảnh Pollux"]}');



-- =======================================================

-- MOCK DATA CHO EVENTS (Sự kiện)

-- (Giả định organizer_id = 1 hoặc 2 là bạn, category_id: 1=Âm nhạc, 2=Hội thảo, 3=Thể thao)

-- =======================================================

INSERT INTO events (organizer_id, title, thumbnail_url, poster_url, description, category_id, status, created_at) VALUES

                                                                                                                      (1, 'Siêu Nhạc Hội Rap Việt All-Star 2026', 'https://example.com/rapviet-thumb.jpg', 'https://example.com/rapviet-poster.jpg', 'Đêm nhạc hội tụ các Rapper hàng đầu Việt Nam với sân khấu hoành tráng.', 1, 'PUBLISHED', '2026-04-01 10:00:00'),

                                                                                                                      (1, 'Hội Nghị Công Nghệ: AI Summit 2026', 'https://example.com/ai-thumb.jpg', 'https://example.com/ai-poster.jpg', 'Hội thảo chuyên sâu về trí tuệ nhân tạo và tương lai của lập trình viên.', 2, 'PUBLISHED', '2026-04-05 09:30:00'),

                                                                                                                      (2, 'Giải Bóng Đá Tứ Hùng Mùa Hè', 'https://example.com/football-thumb.jpg', 'https://example.com/football-poster.jpg', 'Giải bóng đá giao hữu giữa 4 câu lạc bộ hàng đầu V-League.', 3, 'PUBLISHED', '2026-04-08 14:00:00'),

                                                                                                                      (1, 'Liveshow Thanh Âm Mùa Đông (Nháp)', 'https://example.com/winter-thumb.jpg', 'https://example.com/winter-poster.jpg', 'Đêm nhạc chill acoustic nhẹ nhàng. Sự kiện đang lên kế hoạch.', 1, 'DRAFT', '2026-04-09 08:00:00'),

                                                                                                                      (2, 'Triển Lãm Nghệ Thuật Số (Đã Hủy)', 'https://example.com/art-thumb.jpg', 'https://example.com/art-poster.jpg', 'Triển lãm các tác phẩm NFT.', 2, 'CANCELLED', '2026-03-15 15:00:00');



-- =======================================================

-- MOCK DATA CHO EVENT PERFORMANCES (Suất diễn)

-- =======================================================

-- Suất diễn cho Rap Việt (Sự kiện 1) diễn ra 2 đêm ở QK7 (Địa điểm 1)

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES

                                                                                                                          (1, 1, '2026-06-15 19:00:00', '2026-06-15 23:30:00', 15000, 500, 'SOLD_OUT'), -- Đêm 1 cháy vé

                                                                                                                          (1, 1, '2026-06-16 19:00:00', '2026-06-16 23:30:00', 15000, 4500, 'OPEN');    -- Đêm 2 còn vé



-- Suất diễn cho AI Summit (Sự kiện 2) ở Gem Center (Địa điểm 5)

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES

                                                                                                                          (2, 5, '2026-07-10 08:30:00', '2026-07-10 17:00:00', 1000, 200, 'OPEN'),

                                                                                                                          (2, 5, '2026-07-11 08:30:00', '2026-07-11 17:00:00', 1000, 1000, 'OPEN');



-- Suất diễn cho Giải Bóng Đá (Sự kiện 3) ở Mỹ Đình (Địa điểm 3)

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES

                                                                                                                          (3, 3, '2026-08-01 17:00:00', '2026-08-01 19:00:00', 40000, 25000, 'OPEN'),

                                                                                                                          (3, 3, '2026-08-02 17:00:00', '2026-08-02 19:00:00', 40000, 30000, 'OPEN');



-- Suất diễn cho Liveshow Nháp (Sự kiện 4) ở Nhà Hát Hòa Bình (Địa điểm 2)

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES

    (4, 2, '2026-12-24 20:00:00', '2026-12-24 23:00:00', 2500, 2500, 'OPEN');