INSERT INTO events (organizer_id, title, description, category_id, status, venue_id, created_at) VALUES
(1, 'Summer Music Festival 2024', 'Festival nhac lon voi nhieu nghe sy quoc te', 1, 'DRAFT', 31, NOW()),
(2, 'AI & Machine Learning Summit', 'Hoi nghi chuyen sau ve AI va ML', 2, 'DRAFT', 32, NOW()),
(3, 'Yoga & Meditation Workshop', 'Lop hoc Yoga va dam me tinh than', 3, 'DRAFT', 33, NOW()),
(4, 'Traditional Pottery Exhibition', 'Trien lam gom su truyen thong Viet Nam', 4, 'DRAFT', 34, NOW()),
(5, 'Tech Startup Competition', 'Cuoc thi khoi nghiep cong nghe', 5, 'DRAFT', 35, NOW()),
(1, 'Photography Masterclass - Street Photography', 'Lop hoc chup anh duong pho chuyên', 4, 'DRAFT', 36, NOW()),
(2, 'Data Science & Analytics Bootcamp', 'Khoa hoc nang cao phan tich du lieu', 2, 'DRAFT', 37, NOW()),
(3, 'Mindfulness & Stress Management', 'Hoc quan tam va quan ly stress', 3, 'DRAFT', 38, NOW()),
(4, 'Contemporary Art & Sculpture', 'Trien lam nghe thuat hien dai', 4, 'DRAFT', 39, NOW()),
(5, 'Innovation & Entrepreneurship Forum', 'Dien dan trao doi kien thuc khoi nghiep', 5, 'DRAFT', 40, NOW()),
(1, 'Live Jazz Night - Smooth Vibes', 'Dem nhac Jazz thanh lich', 1, 'DRAFT', 41, NOW()),
(2, 'Cloud Computing Masterclass', 'Khoa hoc dieu hanh may chu dam may', 2, 'DRAFT', 42, NOW()),
(3, 'Fitness & Health Expo 2024', 'Hoi cho suc khoe va the duc', 3, 'DRAFT', 43, NOW()),
(4, 'Digital Art & NFT Workshop', 'Workshop nghe thuat so va NFT', 4, 'DRAFT', 44, NOW()),
(5, 'Business Networking Breakfast', 'Bua sang ket noi kinh doanh', 5, 'DRAFT', 45, NOW()),
(1, 'Classical Music Recital - Piano Virtuoso', 'Buoi hoa nhac nhac hoc co dien', 1, 'DRAFT', 46, NOW()),
(2, 'Web Development & JavaScript Advanced', 'Khoa hoc phat trien web nang cao', 2, 'DRAFT', 47, NOW()),
(3, 'Nutrition & Healthy Cooking Workshop', 'Workshop nau an khoe manh', 3, 'DRAFT', 48, NOW()),
(4, 'Street Art & Graffiti Exhibition', 'Trien lam nghe thuat duong pho', 4, 'DRAFT', 49, NOW()),
(5, 'Leadership & Management Training', 'Tao luyeng nhan su quan ly', 5, 'DRAFT', 50, NOW());

INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) 
SELECT id, venue_id, UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 30 DAY)) * 1000, DATE_ADD(NOW(), INTERVAL 31 DAY), 
        FLOOR(RAND()*(5000-300+1))+300, FLOOR(RAND()*(5000-300+1))+300, 'OPEN'
FROM events WHERE status = 'DRAFT' AND id > 15;
