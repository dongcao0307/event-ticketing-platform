-- ==============================================================================
-- THỨ TỰ CHẠY SCRIPT: BƯỚC 2 (Cấu hình Cổng thanh toán & Khởi tạo dữ liệu cơ bản)
-- ==============================================================================
-- FILE: init_paymentprocess.sql
-- PURPOSE: Initialize Payment-related data + Events Setup
-- ==============================================================================
USE ticketbox;

SET FOREIGN_KEY_CHECKS = 0;

-- =======================================================
-- SETUP (Bỏ qua TRUNCATE để tránh mất dữ liệu đã nạp ở Bước 1)
-- =======================================================
-- TRUNCATE TABLE events;
-- TRUNCATE TABLE accounts;
-- TRUNCATE TABLE users;

-- =======================================================
-- INSERT DỮ LIỆU MOCK DATA (Sử dụng IGNORE để tránh lỗi trùng lặp khi chạy sau Bước 1)
-- =======================================================

-- Insert Accounts (Tài khoản đăng nhập)
-- Password: 123456 (BCrypt hash)
INSERT IGNORE INTO accounts (user_name, password, status, role, email, phone) VALUES
('tran_van_hau', '$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi', 'ACTIVE', 'USER', 'tran.vanhau@example.com', '0901234567'),
('admin_user', '$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi', 'ACTIVE', 'ADMIN', 'admin@example.com', '0909876543'),
('event_organizer', '$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi', 'ACTIVE', 'USER', 'organizer@example.com', '0902345678');

-- Insert Users (Thông tin người dùng chi tiết, liên kết với Account)
INSERT IGNORE INTO users (id, full_name, phone_number, city, avatar_url, account_user_name) VALUES
(1, 'Trần Văn Hậu', '0901234567', 'Hồ Chí Minh', 'https://example.com/avatar-hau.jpg', 'tran_van_hau'),
(2, 'Admin User', '0909876543', 'Hà Nội', NULL, 'admin_user'),
(3, 'Event Organizer', '0902345678', 'Hồ Chí Minh', 'https://example.com/avatar-organizer.jpg', 'event_organizer');

-- Insert Venues (6 Địa điểm)
INSERT IGNORE INTO venues (id, name, address, city, seat_map_config) VALUES
(1, 'Sân Vận Động Quân Khu 7', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 'Hồ Chí Minh', '{"zones": ["VIP", "GA"]}'),
(2, 'Trung Tâm Hội Nghị Quốc Gia', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 'Hà Nội', '{"zones": ["Hội trường lớn"]}'),
(3, 'Nhà Hát Hòa Bình', '240-242 Đường 3/2, Phường 12, Quận 10', 'Hồ Chí Minh', '{"zones": ["Tầng 1", "Tầng 2"]}'),
(4, 'Sân Vận Động Quốc Gia Mỹ Đình', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 'Hà Nội', '{"zones": ["Khán đài A", "Khán đài B"]}'),
(5, 'Gem Center', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 'Hồ Chí Minh', '{"zones": ["Sảnh Castor"]}'),
(6, 'Nhà Thi Đấu Trịnh Hoài Đức', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 'Hà Nội', '{"zones": ["Khu vực thi đấu"]}');

-- Insert Events (8 Sự kiện - Đầy đủ thông tin)
INSERT IGNORE INTO events (id, organizer_id, title, description, category_id, category, status, settings_config, thumbnail_url, poster_url, image_url, organizer_name, organizer_logo, organizer_info, location, city, start_time, end_time, min_price, max_price, total_tickets, available_tickets, is_featured, view_count, venue_id) VALUES
(1, 1, 'Siêu Nhạc Hội Rap Việt All-Star 2026', 'Đêm nhạc hội tụ các Rapper hàng đầu Việt Nam. Sự kiện lớn nhất trong năm với lineup nghệ sĩ đình đám. Dự kiến 10,000 khán giả tham dự.', 1, 'MUSIC', 'PUBLISHED', '{"customUrl":"rap-viet-2026","privacy":"public","confirmMsg":"Cảm ơn bạn đã mua vé!"}', 'https://example.com/thumb-rap-2026.jpg', 'https://example.com/poster-rap-2026.jpg', 'https://example.com/img-rap-2026.jpg', 'SpaceSpeakers', 'https://example.com/logo-spacespeakers.png', 'Đơn vị âm nhạc chuyên nghiệp hàng đầu Việt Nam với 10 năm kinh nghiệm tổ chức sự kiện', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 'Hồ Chí Minh', '2026-06-15 19:00:00', '2026-06-15 23:00:00', 800000, 2000000, 10000, 10000, TRUE, 15230, 1),
(2, 1, 'Hội Nghị AI: Tương lai của Web3', 'Hội nghị chuyên sâu về Artificial Intelligence, Blockchain và Web3. Tham dự các bài thuyết trình từ các chuyên gia quốc tế, networking với 1000+ lập trình viên, startup, doanh nghiệp công nghệ.', 2, 'EXHIBITION', 'PUBLISHED', '{"customUrl":"ai-web3","privacy":"public","confirmMsg":"Hẹn gặp bạn tại hội nghị!"}', 'https://example.com/thumb-ai-2026.jpg', 'https://example.com/poster-ai-2026.jpg', 'https://example.com/img-ai-2026.jpg', 'GreenFlow Tech', 'https://example.com/logo-greenflow.png', 'Cộng đồng công nghệ IUH, tổ chức các sự kiện công nghệ hàng tháng', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 'Hà Nội', '2026-07-10 08:00:00', '2026-07-10 17:00:00', 0, 1000000, 1000, 1000, TRUE, 8540, 2),
(3, 1, 'Chung Kết VCS Mùa Hè 2026', 'Giải đấu LMHT lớn nhất Việt Nam, chung kết tranh giải vô địch. Bán kết sôi động giữa 2 đội mạnh nhất với giải thưởng 5 tỷ đồng.', 3, 'FESTIVAL', 'PUBLISHED', '{"customUrl":"vcs-2026","privacy":"public"}', 'https://example.com/thumb-vcs-2026.jpg', 'https://example.com/poster-vcs-2026.jpg', 'https://example.com/img-vcs-2026.jpg', 'VNG Games', 'https://example.com/logo-vng.png', 'Nhà phát hành game hàng đầu Việt Nam, quản lý các giải đấu LMHT chuyên nghiệp', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 'Hà Nội', '2026-08-20 17:00:00', '2026-08-20 22:00:00', 250000, 500000, 2000, 2000, TRUE, 22156, 6),
(4, 1, 'Show Của Đen 2026', 'Liveshow của nghệ sĩ Đen Vâu với các bài hát hit nhất, kết hợp với nhạc live band. Dự kiến 40,000 khán giả, sân khấu công nghệ hàng top Southeast Asia.', 1, 'MUSIC', 'PUBLISHED', '{"customUrl":"den-vau","privacy":"public"}', 'https://example.com/thumb-den-2026.jpg', 'https://example.com/poster-den-2026.jpg', 'https://example.com/img-den-2026.jpg', 'Den Vau Official', 'https://example.com/logo-den.png', 'Nghệ sĩ Rap nổi tiếng, có lượng fan hơn 2 triệu người trên mạng xã hội', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 'Hà Nội', '2026-10-10 20:00:00', '2026-10-10 23:30:00', 750000, 1500000, 40000, 40000, TRUE, 32045, 4),
(5, 1, 'Workshop: UI/UX cho người mới', 'Workshop 3 tiếng hướng dẫn thiết kế giao diện người dùng từ cơ bản đến nâng cao. Giảng viên là designer có 8 năm kinh nghiệm tại các công ty lớn như Tiki, Grab.', 4, 'WORKSHOP', 'DRAFT', '{"customUrl":"uiux-workshop","privacy":"private"}', 'https://example.com/thumb-workshop.jpg', 'https://example.com/poster-workshop.jpg', 'https://example.com/img-workshop.jpg', 'IUH Design Club', 'https://example.com/logo-designclub.png', 'CLB Thiết kế của Đại học Công Nghiệp TP.HCM, chuyên đào tạo và workshop design', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 'Hồ Chí Minh', '2026-09-05 09:00:00', '2026-09-05 12:00:00', 0, 0, 100, 100, FALSE, 567, 5),
(6, 1, 'Giải Marathon IUH 2026', 'Sự kiện chạy bộ từ thiện vì sức khỏe sinh viên. Có 2 cự ly chính: 5km (sơ cấp) và 10km (chuyên nghiệp). Giải thưởng tổng cộng 100 triệu đồng cho top 10 vô địch.', 6, 'SPORTS', 'PENDING', '{"customUrl":"iuh-run","privacy":"public"}', 'https://example.com/thumb-marathon.jpg', 'https://example.com/poster-marathon.jpg', 'https://example.com/img-marathon.jpg', 'IUH Sports', 'https://example.com/logo-iuhsports.png', 'Đoàn Thanh Niên Đại học Công Nghiệp TP.HCM, tổ chức các sự kiện thể thao hàng năm', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 'Hà Nội', '2026-11-20 06:00:00', '2026-11-20 10:00:00', 200000, 350000, 5000, 5000, FALSE, 4230, 2),
(7, 1, 'Kịch: Dạ Cổ Hoài Lang', 'Vở kịch kinh điển Việt Nam được công diễn trên sân khấu Nhà Hát Hòa Bình. 2 tuần diễn liên tục với 15 suất diễn, có 2 diễn viên chính là các tài năng của Nhạc viện Hà Nội.', 5, 'THEATER', 'PUBLISHED', '{"customUrl":"da-co-hoai-lang","privacy":"public"}', 'https://example.com/thumb-theater.jpg', 'https://example.com/poster-theater.jpg', 'https://example.com/img-theater.jpg', 'Idecaf', 'https://example.com/logo-idecaf.png', 'Sân khấu kịch chuyên nghiệp, dàn diễn viên hàng đầu Việt Nam', '240-242 Đường 3/2, Phường 12, Quận 10', 'Hồ Chí Minh', '2026-12-01 19:30:00', '2026-12-02 22:00:00', 300000, 600000, 3000, 3000, FALSE, 6780, 3),
(8, 1, 'EDM Watera Festival', 'Lễ hội âm nhạc điện tử nước theo phong cách quốc tế. DJ lineup từ các nước Nhật, Hàn Quốc, Thái Lan cùng DJ Việt. Tuy nhiên sự kiện đã bị hủy do vấn đề kỹ thuật.', 1, 'MUSIC', 'CANCELLED', '{"customUrl":"watera","privacy":"public"}', 'https://example.com/thumb-watera.jpg', 'https://example.com/poster-watera.jpg', 'https://example.com/img-watera.jpg', 'Watera VN', 'https://example.com/logo-watera.png', 'Tổ chức sự kiện EDM chuyên nghiệp, có kinh nghiệm tổ chức festivals lớn', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 'Hồ Chí Minh', '2026-05-15 16:00:00', '2026-05-16 02:00:00', 500000, 1000000, 15000, 15000, FALSE, 12340, 1);

-- Insert Payment Info (Cho 8 sự kiện)
INSERT IGNORE INTO organizer_payment_infos (event_id, account_owner, account_number, bank_name, bank_branch, tax_code, address) VALUES
(1, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(2, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(3, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(4, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(5, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(6, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(7, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(8, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt');

-- Insert Performances (10 Suất diễn)
INSERT IGNORE INTO event_performances (id, event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES
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

SET FOREIGN_KEY_CHECKS = 1;

-- Insert Ticket Types
INSERT IGNORE INTO ticket_types (performance_id, name, price, total_quantity, max_tickets_per_user, sale_start, sale_end) VALUES
(1, 'Vé VIP', 2000000, 2000, 2, '2026-05-01 09:00:00', '2026-06-14 23:59:59'),
(1, 'Vé GA', 800000, 8000, 4, '2026-05-01 09:00:00', '2026-06-14 23:59:59'),
(2, 'Vé VIP', 2000000, 2000, 2, '2026-05-01 09:00:00', '2026-06-15 23:59:59'),
(2, 'Vé GA', 800000, 8000, 4, '2026-05-01 09:00:00', '2026-06-15 23:59:59'),
(3, 'Vé Standard', 0, 800, 1, '2026-06-01 08:00:00', '2026-07-09 12:00:00'),
(3, 'Vé Business', 1000000, 200, 2, '2026-06-01 08:00:00', '2026-07-09 12:00:00'),
(4, 'Vé Thường', 250000, 1800, 4, '2026-07-01 10:00:00', '2026-08-19 20:00:00'),
(4, 'Vé VIP', 500000, 200, 2, '2026-07-01 10:00:00', '2026-08-19 20:00:00'),
(5, 'Vé Đồng Âm', 750000, 35000, 4, '2026-08-01 00:00:00', '2026-10-09 23:59:59'),
(5, 'Vé VIP', 1500000, 5000, 2, '2026-08-01 00:00:00', '2026-10-09 23:59:59'),
(6, 'Vé Sinh Viên', 0, 100, 1, '2026-08-01 09:00:00', '2026-09-04 18:00:00'),
(7, 'BIB 5KM', 200000, 3000, 1, '2026-09-01 00:00:00', '2026-11-15 23:59:59'),
(7, 'BIB 10KM', 350000, 2000, 1, '2026-09-01 00:00:00', '2026-11-15 23:59:59'),
(8, 'Ghế Thường', 300000, 1000, 4, '2026-11-01 09:00:00', '2026-11-30 18:00:00'),
(8, 'Ghế VIP', 600000, 500, 4, '2026-11-01 09:00:00', '2026-11-30 18:00:00'),
(9, 'Ghế Thường', 300000, 1000, 4, '2026-11-01 09:00:00', '2026-12-01 18:00:00'),
(9, 'Ghế VIP', 600000, 500, 4, '2026-11-01 09:00:00', '2026-12-01 18:00:00');

-- =======================================================
-- PAYMENT METHODS CONFIGURATION (GIỮ NGUYÊN)
-- =======================================================

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('MOMO_SANDBOX', 'MoMo Sandbox', 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png', 1, 'MoMoProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);

INSERT INTO payment_method_config_params (payment_method_id, config_key, config_value)
VALUES
    ('MOMO_SANDBOX', 'mode', 'sandbox'),
    ('MOMO_SANDBOX', 'requestType', 'payWithATM'),
    ('MOMO_SANDBOX', 'lang', 'vi')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);
    
INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('VNPAY_SANDBOX', 'VNPay Sandbox', 'https://sandbox.vnpayment.vn/favicon.ico', 1, 'VNPayProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);

INSERT INTO payment_method_config_params (payment_method_id, config_key, config_value)
VALUES
    ('VNPAY_SANDBOX', 'mode', 'sandbox'),
    ('VNPAY_SANDBOX', 'locale', 'vn'),
    ('VNPAY_SANDBOX', 'currCode', 'VND'),
    ('VNPAY_SANDBOX', 'orderType', 'other')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);

INSERT INTO payment_methods (id, display_name, logo_url, is_available, processor_type)
VALUES ('FREE', 'Mien phi', NULL, 1, 'FreeProcessor')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    logo_url = VALUES(logo_url),
    is_available = VALUES(is_available),
    processor_type = VALUES(processor_type);