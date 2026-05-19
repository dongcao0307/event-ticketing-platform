-- V1__init_schema.sql
-- Create Venues table
CREATE TABLE venues (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  seat_map_config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events table
CREATE TABLE events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organizer_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(500),
  poster_url VARCHAR(500),
  description LONGTEXT,
  category_id BIGINT,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  venue_id BIGINT,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_organizer (organizer_id)
);

-- Create Event Performances table
CREATE TABLE event_performances (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT NOT NULL,
  venue_id BIGINT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_capacity INT NOT NULL,
  available_capacity INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  INDEX idx_event (event_id)
);

-- Insert test venues
INSERT INTO venues (name, address, city) VALUES
('Hoi Duong Hoa Binh', '123 Nguyen Hue, Q.1', 'TP.HCM'),
('GEM Center', '456 Nguyen Huu Canh, Q.4', 'TP.HCM'),
('San van dong My Dinh', '789 Duong Tran Phu, Ba Dinh', 'Ha Noi'),
('Online', NULL, 'Online'),
('Bao tang Hoi hoa', '111 Vo Van Tan, Q.5', 'TP.HCM');

-- Insert test events
INSERT INTO events (organizer_id, title, description, category_id, status, venue_id) VALUES
(1, 'Concert 2024 - The Grand Stage', 'Dem nhac hoi hoanh trang', 1, 'DRAFT', 1),
(2, 'Tech Conference Vietnam', 'Hoi nghi cong nghe lon nhat', 2, 'DRAFT', 2),
(3, 'Online Webinar - Digital Marketing', 'Hoc xay dung chien luoc marketing', 3, 'DRAFT', 4),
(4, 'Art Exhibition 2024', 'Trien lam nghe thuat', 4, 'DRAFT', 5),
(5, 'Startup Meetup - Pitch Day', 'Su kien ket noi startup', 5, 'DRAFT', 3),
(6, 'Super Show 10 - Super Junior', 'Concert am nhac noi tieng', 1, 'PUBLISHER', 3),
(7, 'HER Concert - Hoa nhac lang man', 'Dem hoa nhac lang man', 1, 'PUBLISHER', 1),
(8, 'Hoi cho Workshop Handmade', 'Workshop tao tay', 4, 'PUBLISHER', 5),
(9, 'DE GARDEN Moss Frame Workshop', 'Workshop trang tri', 4, 'PUBLISHER', 2),
(10, 'ART WORKSHOP - FRENCH LEMON MINI TARTE', 'Workshop nau an', 4, 'PUBLISHER', 1),
(11, 'SAN KHAU XOM KICH', 'Kich noi doc lap', 4, 'PUBLISHER', 1),
(12, 'IN BONG LONG THANH', 'Chuong trinh bieu dien', 4, 'PUBLISHER', 3),
(13, 'Cancelled Event 1', 'Su kien bi huy', 2, 'CANCELLED', 2),
(14, 'Event Bi Tu Choi', 'Su kien khong dat tieu chuan', 3, 'CANCELLED', 4),
(15, 'Huy Bo - Khong Phu Hop', 'Su kien khong phu hop', 5, 'CANCELLED', NULL);

-- Insert event performances
INSERT INTO event_performances (event_id, venue_id, start_time, end_time, total_capacity, available_capacity, status) VALUES
(1, 1, 1710521100000, '2024-03-15 22:30:00', 1500, 1500, 'OPEN'),
(2, 2, 1712250000000, '2024-04-05 18:00:00', 2000, 1850, 'OPEN'),
(3, 4, 1709023200000, '2024-02-28 17:00:00', 5000, 4750, 'OPEN'),
(4, 5, 1709286000000, '2024-03-01 20:00:00', 800, 750, 'OPEN'),
(5, 3, 1708874400000, '2024-02-25 21:00:00', 1000, 950, 'OPEN'),
(6, 3, 1714588200000, '2026-05-02 22:00:00', 10000, 5000, 'SOLD_OUT'),
(7, 1, 1707268800000, '2026-02-07 18:00:00', 1200, 1100, 'OPEN'),
(8, 5, 1711334400000, '2026-03-25 19:00:00', 500, 480, 'OPEN'),
(9, 2, 1708444800000, '2026-02-20 16:00:00', 300, 250, 'OPEN'),
(10, 1, 1708444800000, '2026-02-20 17:00:00', 250, 200, 'OPEN');
