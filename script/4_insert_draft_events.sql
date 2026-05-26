-- ==============================================================================
-- THỨ TỰ CHẠY SCRIPT: BƯỚC 4 (Bổ sung các sự kiện nháp DRAFT để test chức năng duyệt)
-- ==============================================================================
-- FILE: insert_draft_events.sql
-- PURPOSE: Insert Draft Events for Testing
-- ==============================================================================
USE ticketbox;

INSERT INTO events (organizer_id, title, description, category_id, category, status, venue_id, created_at) VALUES
(1, 'Summer Music Festival 2024', 'Festival nhac lon voi nhieu nghe sy quoc te', 1, 'MUSIC', 'DRAFT', 1, NOW()),
(2, 'AI & Machine Learning Summit', 'Hoi nghi chuyen sau ve AI va ML', 2, 'EXHIBITION', 'DRAFT', 2, NOW()),
(3, 'Yoga & Meditation Workshop', 'Lop hoc Yoga va dam me tinh than', 3, 'FESTIVAL', 'DRAFT', 3, NOW()),
(4, 'Traditional Pottery Exhibition', 'Trien lam gom su truyen thong Viet Nam', 4, 'WORKSHOP', 'DRAFT', 4, NOW()),
(5, 'Tech Startup Competition', 'Cuoc thi khoi nghiep cong nghe', 5, 'THEATER', 'DRAFT', 5, NOW()),
(1, 'Photography Masterclass - Street Photography', 'Lop hoc chup anh duong pho chuyên', 4, 'WORKSHOP', 'DRAFT', 6, NOW()),
(2, 'Data Science & Analytics Bootcamp', 'Khoa hoc nang cao phan tich du lieu', 2, 'EXHIBITION', 'DRAFT', 1, NOW()),
(3, 'Mindfulness & Stress Management', 'Hoc quan tam va quan ly stress', 3, 'FESTIVAL', 'DRAFT', 2, NOW()),
(4, 'Contemporary Art & Sculpture', 'Trien lam nghe thuat hien dai', 4, 'WORKSHOP', 'DRAFT', 3, NOW()),
(5, 'Innovation & Entrepreneurship Forum', 'Dien dan trao doi kien thuc khoi nghiep', 5, 'THEATER', 'DRAFT', 4, NOW()),
(1, 'Live Jazz Night - Smooth Vibes', 'Dem nhac Jazz thanh lich', 1, 'MUSIC', 'DRAFT', 5, NOW()),
(2, 'Cloud Computing Masterclass', 'Khoa hoc dieu hanh may chu dam may', 2, 'EXHIBITION', 'DRAFT', 6, NOW()),
(3, 'Fitness & Health Expo 2024', 'Hoi cho suc khoe va the duc', 3, 'FESTIVAL', 'DRAFT', 1, NOW()),
(4, 'Digital Art & NFT Workshop', 'Workshop nghe thuat so va NFT', 4, 'WORKSHOP', 'DRAFT', 2, NOW()),
(5, 'Business Networking Breakfast', 'Bua sang ket noi kinh doanh', 5, 'THEATER', 'DRAFT', 3, NOW()),
(1, 'Classical Music Recital - Piano Virtuoso', 'Buoi hoa nhac nhac hoc co dien', 1, 'MUSIC', 'DRAFT', 4, NOW()),
(2, 'Web Development & JavaScript Advanced', 'Khoa hoc phat trien web nang cao', 2, 'EXHIBITION', 'DRAFT', 5, NOW()),
(3, 'Nutrition & Healthy Cooking Workshop', 'Workshop nau an khoe manh', 3, 'FESTIVAL', 'DRAFT', 6, NOW()),
(4, 'Street Art & Graffiti Exhibition', 'Trien lam nghe thuat duong pho', 4, 'WORKSHOP', 'DRAFT', 1, NOW()),
(5, 'Leadership & Management Training', 'Tao luyeng nhan su quan ly', 5, 'THEATER', 'DRAFT', 2, NOW());

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) 
SELECT id, venue_id, DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 31 DAY), 
        FLOOR(RAND()*(5000-300+1))+300, FLOOR(RAND()*(5000-300+1))+300, 'OPEN'
FROM events WHERE status = 'DRAFT' AND id > 15;
