-- =======================================================
-- FILE: event_platform_full_setup.sql
-- AUTHOR: Generated for PM Tran Van Hau (GreenFlow Team)
-- PURPOSE: Full Database Setup & Rich Mock Data for 2026
-- =======================================================

-- Tạm thời tắt kiểm tra khóa ngoại để xóa bảng cũ không bị lỗi
SET FOREIGN_KEY_CHECKS = 0;

-- =======================================================
-- 1. DỌN DẸP BẢNG CŨ (NẾU CÓ)
-- =======================================================
DROP TABLE IF EXISTS ticket_types;
DROP TABLE IF EXISTS event_performances;
DROP TABLE IF EXISTS organizer_payment_info;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venues;

-- =======================================================
-- 2. TẠO CẤU TRÚC BẢNG (FULL GIÁP)
-- =======================================================

-- Bảng Địa điểm (Venues)
CREATE TABLE venues (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        address VARCHAR(255),
                        city VARCHAR(100),
                        seat_map_config TEXT
);

-- Bảng Sự kiện (Events)
CREATE TABLE events (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(200) NOT NULL,
                        description TEXT,
                        organizer_id BIGINT NOT NULL,
                        category_id BIGINT NOT NULL,
                        category VARCHAR(20) DEFAULT 'OTHER',
                        status VARCHAR(20) DEFAULT 'DRAFT',
                        settings_config TEXT,
                        thumbnail_url VARCHAR(500),
                        poster_url VARCHAR(500),
                        image_url VARCHAR(500),
                        organizer_name VARCHAR(200),
                        organizer_logo VARCHAR(500),
                        organizer_info TEXT,
                        location VARCHAR(200),
                        city VARCHAR(100),
                        start_time DATETIME,
                        end_time DATETIME,
                        min_price DECIMAL(15,0),
                        max_price DECIMAL(15,0),
                        total_tickets INT,
                        available_tickets INT,
                        is_featured BOOLEAN DEFAULT FALSE,
                        view_count INT DEFAULT 0,
                        venue_id BIGINT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- Bảng Thông tin thanh toán (Step 4)
CREATE TABLE organizer_payment_info (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        event_id BIGINT NOT NULL UNIQUE,
                                        account_owner VARCHAR(255),
                                        account_number VARCHAR(255),
                                        bank_name VARCHAR(255),
                                        bank_branch VARCHAR(255),
                                        tax_code VARCHAR(255),
                                        address VARCHAR(255),
                                        CONSTRAINT fk_payment_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Bảng Suất diễn (Step 2)
CREATE TABLE event_performances (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    event_id BIGINT NOT NULL,
                                    venue_id BIGINT,
                                    start_time DATETIME,
                                    end_time DATETIME,
                                    total_capacity INT,
                                    available_capacity INT,
                                    status VARCHAR(50) DEFAULT 'OPEN',
                                    CONSTRAINT fk_performance_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                                    CONSTRAINT fk_performance_venue FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- Bảng Loại vé (Step 2)
CREATE TABLE ticket_types (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              performance_id BIGINT NOT NULL,
                              name VARCHAR(255),
                              price DECIMAL(15,0),
                              total_quantity INT,
                              sold_quantity INT DEFAULT 0,
                              reserved_quantity INT DEFAULT 0,
                              max_tickets_per_user INT DEFAULT 10,
                              sale_start VARCHAR(100),
                              sale_end VARCHAR(100),
                              version BIGINT DEFAULT 0,
                              CONSTRAINT fk_ticket_performance FOREIGN KEY (performance_id) REFERENCES event_performances(id) ON DELETE CASCADE
);

-- =======================================================
-- 3. ĐỔ DỮ LIỆU MOCK DATA (CỰC KỲ CHI TIẾT)
-- =======================================================

-- 3.1 Insert Venues (6 Địa điểm)
INSERT INTO venues (id, name, address, city, seat_map_config) VALUES
                                                                  (1, 'Sân Vận Động Quân Khu 7', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 'Hồ Chí Minh', '{"zones": ["VIP", "GA"]}'),
                                                                  (2, 'Trung Tâm Hội Nghị Quốc Gia', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 'Hà Nội', '{"zones": ["Hội trường lớn"]}'),
                                                                  (3, 'Nhà Hát Hòa Bình', '240-242 Đường 3/2, Phường 12, Quận 10', 'Hồ Chí Minh', '{"zones": ["Tầng 1", "Tầng 2"]}'),
                                                                  (4, 'Sân Vận Động Quốc Gia Mỹ Đình', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 'Hà Nội', '{"zones": ["Khán đài A", "Khán đài B"]}'),
                                                                  (5, 'Gem Center', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 'Hồ Chí Minh', '{"zones": ["Sảnh Castor"]}'),
                                                                  (6, 'Nhà Thi Đấu Trịnh Hoài Đức', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 'Hà Nội', '{"zones": ["Khu vực thi đấu"]}');

-- 3.2 Insert Events (8 Sự kiện - Giả định organizer_id = 1 là PM Hậu)
INSERT INTO events (id, organizer_id, title, description, category_id, category, status, settings_config, organizer_name, organizer_logo, organizer_info, venue_id) VALUES
                                                                                                                                                                        (1, 1, 'Siêu Nhạc Hội Rap Việt All-Star 2026', 'Đêm nhạc hội tụ các Rapper hàng đầu Việt Nam.', 1, 'MUSIC', 'PUBLISHED', '{"customUrl":"rap-viet-2026","privacy":"public","confirmMsg":"Cảm ơn bạn đã mua vé!"}', 'SpaceSpeakers', 'https://example.com/logo1.png', 'Đơn vị âm nhạc chuyên nghiệp', 1),
                                                                                                                                                                        (2, 1, 'Hội Nghị AI: Tương lai của Web3', 'Xu hướng AI và Blockchain 2026.', 2, 'SEMINAR', 'PUBLISHED', '{"customUrl":"ai-web3","privacy":"public","confirmMsg":"Hẹn gặp bạn tại hội nghị!"}', 'GreenFlow Tech', 'https://example.com/logo2.png', 'Cộng đồng công nghệ IUH', 2),
                                                                                                                                                                        (3, 1, 'Chung Kết VCS Mùa Hè 2026', 'Giải đấu LMHT lớn nhất Việt Nam.', 3, 'ESPORTS', 'PUBLISHED', '{"customUrl":"vcs-2026","privacy":"public"}', 'VNG Games', 'https://example.com/logo3.png', 'Nhà phát hành game', 6),
                                                                                                                                                                        (4, 1, 'Show Của Đen 2026', 'Liveshow của nghệ sĩ Đen Vâu.', 1, 'MUSIC', 'PUBLISHED', '{"customUrl":"den-vau","privacy":"public"}', 'Den Vau Official', 'https://example.com/logo4.png', 'Nghệ sĩ Rap', 4),
                                                                                                                                                                        (5, 1, 'Workshop: UI/UX cho người mới', 'Học thiết kế trong 3 tiếng.', 4, 'WORKSHOP', 'DRAFT', '{"customUrl":"uiux-workshop","privacy":"private"}', 'IUH Design Club', 'https://example.com/logo5.png', 'CLB Thiết kế', 5),
                                                                                                                                                                        (6, 1, 'Giải Marathon IUH 2026', 'Chạy bộ vì sức khỏe sinh viên.', 6, 'SPORTS', 'PENDING', '{"customUrl":"iuh-run","privacy":"public"}', 'IUH Sports', 'https://example.com/logo6.png', 'Đoàn Thanh Niên IUH', 2),
                                                                                                                                                                        (7, 1, 'Kịch: Dạ Cổ Hoài Lang', 'Vở kịch kinh điển Việt Nam.', 5, 'THEATER', 'PUBLISHED', '{"customUrl":"da-co-hoai-lang","privacy":"public"}', 'Idecaf', 'https://example.com/logo7.png', 'Sân khấu kịch', 3),
                                                                                                                                                                        (8, 1, 'EDM Watera Festival', 'Lễ hội âm nhạc nước.', 1, 'MUSIC', 'CANCELLED', '{"customUrl":"watera","privacy":"public"}', 'Watera VN', 'https://example.com/logo8.png', 'Tổ chức sự kiện EDM', 1);

-- 3.3 Insert Payment Info (Cho 8 sự kiện)
INSERT INTO organizer_payment_info (event_id, account_owner, account_number, bank_name, bank_branch, tax_code, address) VALUES
                                                                                                                            (1, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (2, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (3, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (4, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (5, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (6, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (7, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
                                                                                                                            (8, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt');

-- 3.4 Insert Performances (10 Suất diễn)
INSERT INTO event_performances (id, event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES
                                                                                                                              (1, 1, 1, '2026-06-15 19:00:00', '2026-06-15 23:00:00', 10000, 10000, 'OPEN'),
                                                                                                                              (2, 1, 1, '2026-06-16 19:00:00', '2026-06-16 23:00:00', 10000, 10000, 'OPEN'),
                                                                                                                              (3, 2, 2, '2026-07-10 08:00:00', '2026-07-10 17:00:00', 1000, 1000, 'OPEN'),
                                                                                                                              (4, 3, 6, '2026-08-20 17:00:00', '2026-08-20 22:00:00', 2000, 2000, 'OPEN'),
                                                                                                                              (5, 4, 4, '2026-10-10 20:00:00', '2026-10-10 23:30:00', 40000, 40000, 'OPEN'),
                                                                                                                              (6, 5, 5, '2026-09-05 09:00:00', '2026-09-05 12:00:00', 100, 100, 'OPEN'),
                                                                                                                              (7, 6, 2, '2026-11-20 06:00:00', '2026-11-20 10:00:00', 5000, 5000, 'OPEN'),
                                                                                                                              (8, 7, 3, '2026-12-01 19:30:00', '2026-12-01 22:00:00', 1500, 1500, 'OPEN'),
                                                                                                                              (9, 7, 3, '2026-12-02 19:30:00', '2026-12-02 22:00:00', 1500, 1500, 'OPEN'),
                                                                                                                              (10, 8, 1, '2026-05-15 16:00:00', '2026-05-16 02:00:00', 15000, 15000, 'CANCELLED');

-- 3.5 Insert Ticket Types (19 Loại vé với đầy đủ giới hạn mua và ngày bán)
INSERT INTO ticket_types (performance_id, name, price, total_quantity, max_tickets_per_user, sale_start, sale_end) VALUES
-- Rap Viet Perf 1
(1, 'Vé VIP', 2000000, 2000, 2, '01-05-2026 09:00', '14-06-2026 23:59'),
(1, 'Vé GA', 800000, 8000, 4, '01-05-2026 09:00', '14-06-2026 23:59'),
-- Rap Viet Perf 2
(2, 'Vé VIP', 2000000, 2000, 2, '01-05-2026 09:00', '15-06-2026 23:59'),
(2, 'Vé GA', 800000, 8000, 4, '01-05-2026 09:00', '15-06-2026 23:59'),
-- AI Summit Perf 3 (Free)
(3, 'Vé Standard', 0, 800, 1, '01-06-2026 08:00', '09-07-2026 12:00'),
(3, 'Vé Business', 1000000, 200, 2, '01-06-2026 08:00', '09-07-2026 12:00'),
-- VCS Perf 4
(4, 'Vé Thường', 250000, 1800, 4, '01-07-2026 10:00', '19-08-2026 20:00'),
(4, 'Vé VIP', 500000, 200, 2, '01-07-2026 10:00', '19-08-2026 20:00'),
-- Den Vau Perf 5
(5, 'Vé Đồng Âm', 750000, 35000, 4, '01-08-2026 00:00', '09-10-2026 23:59'),
(5, 'Vé VIP', 1500000, 5000, 2, '01-08-2026 00:00', '09-10-2026 23:59'),
-- Workshop Perf 6 (Free)
(6, 'Vé Sinh Viên', 0, 100, 1, '01-08-2026 09:00', '04-09-2026 18:00'),
-- IUH Run Perf 7
(7, 'BIB 5KM', 200000, 3000, 1, '01-09-2026 00:00', '15-11-2026 23:59'),
(7, 'BIB 10KM', 350000, 2000, 1, '01-09-2026 00:00', '15-11-2026 23:59'),
-- Theater Perf 8 & 9
(8, 'Ghế Thường', 300000, 1000, 4, '01-11-2026 09:00', '30-11-2026 18:00'),
(8, 'Ghế VIP', 600000, 500, 4, '01-11-2026 09:00', '30-11-2026 18:00'),
(9, 'Ghế Thường', 300000, 1000, 4, '01-11-2026 09:00', '01-12-2026 18:00'),
(9, 'Ghế VIP', 600000, 500, 4, '01-11-2026 09:00', '01-12-2026 18:00');

-- Bật lại kiểm tra khóa ngoại sau khi setup xong
SET FOREIGN_KEY_CHECKS = 1;