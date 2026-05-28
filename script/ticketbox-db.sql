-- ==============================================================================
-- DỰ ÁN TICKETBOX - TỔNG HỢP TOÀN BỘ CƠ SỞ DỮ LIỆU & 100 SỰ KIỆN MẪU
-- ==============================================================================
-- LƯU Ý: FILE NÀY GỘP TOÀN BỘ CÁC BƯỚC THIẾT LẬP DATABASE VÀ POPULATE DỮ LIỆU.
-- BẠN CHỈ CẦN CHẠY DUY NHẤT FILE NÀY ĐỂ KHỞI TẠO HỆ THỐNG.
-- ==============================================================================

-- ==============================================================================
-- THỨ TỰ CHẠY SCRIPT: BƯỚC 1 (Khởi tạo Database, Schema gốc & Dữ liệu ban đầu)
-- ==============================================================================
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: ticketbox
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `user_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('USER','ADMIN','ORGANIZER') NOT NULL,
  `status` enum('ACTIVE','BANNED','LOCKED') NOT NULL,
  PRIMARY KEY (`user_name`),
  UNIQUE KEY `UK_n7ihswpy07ci568w34q0oi8he` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('admin_user','admin@example.com','$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi','0909876543','ADMIN','ACTIVE'),('dongcao','caothanhdong.41118@gmail.com','$2a$10$TBVg0/rbU.2lZUQpmx2HKevl3wCsD1Ae8kfY/.mZRpSf.gdON9xCS','09876543210','USER','ACTIVE'),('event_organizer','organizer@example.com','$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi','0902345678','USER','ACTIVE'),('tran_van_hau','tran.vanhau@example.com','$2a$10$BI7fwuuwNNDv447lS36y4utu0kxgZMT7q9mek.3IHxuD8iScuZ3hi','0901234567','USER','ACTIVE');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_items`
--

DROP TABLE IF EXISTS `booking_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `ticket_type_id` bigint NOT NULL,
  `unit_price` decimal(38,2) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrw74irmyat5c39cnjkn02u99m` (`booking_id`),
  CONSTRAINT `FKrw74irmyat5c39cnjkn02u99m` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `booking_items_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `booking_items_chk_2` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES (1,1,1,2000000.00,1),(2,1,2,800000.00,1),(3,1,2,800000.00,2);
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `discount_amount` decimal(38,2) NOT NULL,
  `expired_at` datetime(6) NOT NULL,
  `idempotence_key` varchar(80) NOT NULL,
  `status` enum('CANCELLED','EXPIRED','PAID','PENDING') NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `user_id` bigint NOT NULL,
  `version` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKb2169yf9jcw4xtwto2acs6jgl` (`idempotence_key`),
  CONSTRAINT `bookings_chk_1` CHECK ((`discount_amount` >= 0)),
  CONSTRAINT `bookings_chk_2` CHECK ((`subtotal` >= 0)),
  CONSTRAINT `bookings_chk_3` CHECK ((`total_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2026-05-22 10:41:16.390443',0.00,'2026-05-22 10:56:16.390443','BOOK-1-1-1779446475409','PAID',2800000.00,2800000.00,4,3),(2,'2026-05-22 14:42:04.372896',0.00,'2026-05-22 14:57:04.372896','BOOK-1-1-1779460924252','PENDING',800000.00,800000.00,2,2);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_performances`
--

DROP TABLE IF EXISTS `event_performances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_performances` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_capacity` int DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `status` enum('OPEN','SOLD_OUT','POSTPONED','CANCELLED') DEFAULT NULL,
  `total_capacity` int DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  `venue_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg5pbbdtogfsvgy5yv0r4l3ufg` (`event_id`),
  KEY `FK68ua48m73jw9gcjjj3u4dfp5u` (`venue_id`),
  CONSTRAINT `FK68ua48m73jw9gcjjj3u4dfp5u` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`),
  CONSTRAINT `FKg5pbbdtogfsvgy5yv0r4l3ufg` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_performances`
--

LOCK TABLES `event_performances` WRITE;
/*!40000 ALTER TABLE `event_performances` DISABLE KEYS */;
INSERT INTO `event_performances` VALUES (1,10000,'2026-06-15 23:00:00.000000','2026-06-15 19:00:00.000000','OPEN',10000,1,1),(2,10000,'2026-06-16 23:00:00.000000','2026-06-16 19:00:00.000000','OPEN',10000,1,1),(3,1000,'2026-07-10 17:00:00.000000','2026-07-10 08:00:00.000000','OPEN',1000,2,2),(4,2000,'2026-08-20 22:00:00.000000','2026-08-20 17:00:00.000000','OPEN',2000,3,6),(5,40000,'2026-10-10 23:30:00.000000','2026-10-10 20:00:00.000000','OPEN',40000,4,4),(6,100,'2026-09-05 12:00:00.000000','2026-09-05 09:00:00.000000','OPEN',100,5,5),(7,5000,'2026-11-20 10:00:00.000000','2026-11-20 06:00:00.000000','OPEN',5000,6,2),(8,1500,'2026-12-01 22:00:00.000000','2026-12-01 19:30:00.000000','OPEN',1500,7,3),(9,1500,'2026-12-02 22:00:00.000000','2026-12-02 19:30:00.000000','OPEN',1500,7,3),(10,15000,'2026-05-16 02:00:00.000000','2026-05-15 16:00:00.000000','CANCELLED',15000,8,1);
/*!40000 ALTER TABLE `event_performances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_tickets` int DEFAULT NULL,
  `category` enum('MUSIC','THEATER','SPORTS','WORKSHOP','FESTIVAL','COMEDY','EXHIBITION','OTHER') NOT NULL,
  `category_id` bigint NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `end_time` datetime(6) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_featured` bit(1) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `max_price` decimal(15,0) DEFAULT NULL,
  `min_price` decimal(15,0) DEFAULT NULL,
  `organizer_id` bigint NOT NULL,
  `organizer_info` text,
  `organizer_logo` varchar(500) DEFAULT NULL,
  `organizer_name` varchar(200) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `settings_config` text,
  `start_time` datetime(6) DEFAULT NULL,
  `status` enum('DRAFT','PENDING','PUBLISHED','CANCELLED') NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `total_tickets` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  `venue_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqdxygdernwwt74hdvix9u5nr3` (`venue_id`),
  CONSTRAINT `FKqdxygdernwwt74hdvix9u5nr3` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,10000,'MUSIC',1,'Hồ Chí Minh','2026-05-22 10:55:16.000000','Đêm nhạc hội tụ các Rapper hàng đầu Việt Nam. Sự kiện lớn nhất trong năm với lineup nghệ sĩ đình đám. Dự kiến 10,000 khán giả tham dự.','2026-06-15 23:00:00.000000','https://toquoc.mediacdn.vn/280518851207290880/2022/11/8/a61fa189-kosmik-3-1667910320048694823528.jpg',_binary '','202 Hoàng Văn Thụ, Phường 9, Phú Nhuận',2000000,800000,1,'Đơn vị âm nhạc chuyên nghiệp hàng đầu Việt Nam với 10 năm kinh nghiệm tổ chức sự kiện','https://example.com/logo-spacespeakers.png','SpaceSpeakers','https://cdn.nhanlucnganhluat.vn/uploads/images/D7C3E122/logo/2023-05/logo.jpg','{\"customUrl\":\"rap-viet-2026\",\"privacy\":\"public\",\"confirmMsg\":\"Cảm ơn bạn đã mua vé!\"}','2026-06-15 19:00:00.000000','PUBLISHED','https://i.ytimg.com/vi/Z53je4kMd6k/maxresdefault.jpg','Siêu Nhạc Hội Rap Việt All-Star 2026',10000,'2026-05-22 10:55:16.000000',15236,1),(2,1000,'EXHIBITION',2,'Hà Nội','2026-05-22 10:55:16.000000','Hội nghị chuyên sâu về Artificial Intelligence, Blockchain và Web3. Tham dự các bài thuyết trình từ các chuyên gia quốc tế, networking với 1000+ lập trình viên, startup, doanh nghiệp công nghệ.','2026-07-10 17:00:00.000000','https://tse1.mm.bing.net/th/id/OIP.3XW2iDFa289loVVFIHgoGAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',_binary '','Cổng số 1, Đại lộ Thăng Long, Mễ Trì',1000000,0,1,'Cộng đồng công nghệ IUH, tổ chức các sự kiện công nghệ hàng tháng','https://tse2.mm.bing.net/th/id/OIP._vtQlNwTZhnYNS6dG543pQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3','GreenFlow Tech','https://tse4.mm.bing.net/th/id/OIP.vRz8KxEhn25v3mIbUoPWlwHaEK?w=816&h=459&rs=1&pid=ImgDetMain&o=7&rm=3','{\"customUrl\":\"ai-web3\",\"privacy\":\"public\",\"confirmMsg\":\"Hẹn gặp bạn tại hội nghị!\"}','2026-07-10 08:00:00.000000','PUBLISHED','https://tse4.mm.bing.net/th/id/OIP.vRz8KxEhn25v3mIbUoPWlwHaEK?w=816&h=459&rs=1&pid=ImgDetMain&o=7&rm=3','Hội Nghị AI: Tương lai của Web3',1000,'2026-05-22 10:55:16.000000',8542,2),(3,2000,'FESTIVAL',3,'Hà Nội','2026-05-22 10:55:16.000000','Giải đấu LMHT lớn nhất Việt Nam, chung kết tranh giải vô địch. Bán kết sôi động giữa 2 đội mạnh nhất với giải thưởng 5 tỷ đồng.','2026-08-20 22:00:00.000000','https://hoanghamobile.com/tin-tuc/wp-content/uploads/2026/01/vcs-2026-thumb.jpg',_binary '','12 Trịnh Hoài Đức, Cát Linh, Đống Đa',500000,250000,1,'Nhà phát hành game hàng đầu Việt Nam, quản lý các giải đấu LMHT chuyên nghiệp','https://tse4.mm.bing.net/th/id/OIP.HgfE2w68FKRHfvtVC97nTgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3','VNG Games','https://tse2.mm.bing.net/th/id/OIP.zfIUNQGHjNYVkMTn2h57xQHaCq?rs=1&pid=ImgDetMain&o=7&rm=3','{\"customUrl\":\"vcs-2026\",\"privacy\":\"public\"}','2026-08-20 17:00:00.000000','PUBLISHED','https://cdn-media.sforum.vn/storage/app/media/phuonganh/VCS-2026-7.jpg','Chung Kết VCS Mùa Hè 2026',2000,'2026-05-22 10:55:16.000000',22156,6),(4,40000,'MUSIC',1,'Hà Nội','2026-05-22 10:55:16.000000','Liveshow của nghệ sĩ Đen Vâu với các bài hát hit nhất, kết hợp với nhạc live band. Dự kiến 40,000 khán giả, sân khấu công nghệ hàng top Southeast Asia.','2026-10-10 23:30:00.000000','https://dilib.vn/img/news/2025/02/larger/6186-den-vau-liveshow-2019-1.jpg?v=8716',_binary '','Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm',1500000,750000,1,'Nghệ sĩ Rap nổi tiếng, có lượng fan hơn 2 triệu người trên mạng xã hội','https://i.ytimg.com/vi/jjr-BGS7enA/maxresdefault.jpg','Den Vau Official','https://kenh14cdn.com/zoom/600_315/2019/10/30/ava1-1572444546123448078564-crop-15724445616591888143219.jpg','{\"customUrl\":\"den-vau\",\"privacy\":\"public\"}','2026-10-10 20:00:00.000000','PUBLISHED','https://th.bing.com/th/id/R.49776c0772e9701eac68aca0c0b9b68c?rik=uwtkm9NOMxnyGQ&pid=ImgRaw&r=0','Show Của Đen 2026',40000,'2026-05-22 10:55:16.000000',32045,4),(5,100,'WORKSHOP',4,'Hồ Chí Minh','2026-05-22 10:55:16.000000','Workshop 3 tiếng hướng dẫn thiết kế giao diện người dùng từ cơ bản đến nâng cao. Giảng viên là designer có 8 năm kinh nghiệm tại các công ty lớn như Tiki, Grab.','2026-09-05 12:00:00.000000','https://tse3.mm.bing.net/th/id/OIP.RUcCRb_O2C0RaeRS-czs4QHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',_binary '\0','8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1',0,0,1,'CLB Thiết kế của Đại học Công Nghiệp TP.HCM, chuyên đào tạo và workshop design','https://iuh.edu.vn/assets/images/news-default.png','IUH Design Club','https://edu.keyframe.vn/wp-content/uploads/2022/05/Workshop-Become-UXUI-Designer-from-Graphic-Designer-720.jpg','{\"customUrl\":\"uiux-workshop\",\"privacy\":\"private\"}','2026-09-05 09:00:00.000000','DRAFT','https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/334533448/original/8ec6d95d971fc15a5c0f2746aba9f41cc60a4a5f/do-unique-and-high-quality-ux-ui-design.png','Workshop: UI/UX cho người mới',100,'2026-05-22 10:55:16.000000',567,5),(6,5000,'SPORTS',6,'Hà Nội','2026-05-22 10:55:16.000000','Sự kiện chạy bộ từ thiện vì sức khỏe sinh viên. Có 2 cự ly chính: 5km (sơ cấp) và 10km (chuyên nghiệp). Giải thưởng tổng cộng 100 triệu đồng cho top 10 vô địch.','2026-11-20 10:00:00.000000','https://thumbs.dreamstime.com/z/group-marathon-runners-abstract-swirl-backgr-21317626.jpg',_binary '\0','Cổng số 1, Đại lộ Thăng Long, Mễ Trì',350000,200000,1,'Đoàn Thanh Niên Đại học Công Nghiệp TP.HCM, tổ chức các sự kiện thể thao hàng năm','https://logos-world.net/wp-content/uploads/2023/05/Marathon-Petroleum-Logo.jpg','IUH Sports','https://tse3.mm.bing.net/th/id/OIP.OFwxrB_sD7mnca6lUAevgQHaE7?w=640&h=426&rs=1&pid=ImgDetMain&o=7&rm=3','{\"customUrl\":\"iuh-run\",\"privacy\":\"public\"}','2026-11-20 06:00:00.000000','PENDING','https://tse3.mm.bing.net/th/id/OIP.OFwxrB_sD7mnca6lUAevgQHaE7?w=640&h=426&rs=1&pid=ImgDetMain&o=7&rm=3','Giải Marathon IUH 2026',5000,'2026-05-22 10:55:16.000000',4230,2),(7,3000,'THEATER',5,'Hồ Chí Minh','2026-05-22 10:55:16.000000','Vở kịch kinh điển Việt Nam được công diễn trên sân khấu Nhà Hát Hòa Bình. 2 tuần diễn liên tục với 15 suất diễn, có 2 diễn viên chính là các tài năng của Nhạc viện Hà Nội.','2026-12-02 22:00:00.000000','https://img.cand.com.vn/resize/800x800/NewFiles/Images/2021/10/24/sk-1635046249009.jpg',_binary '\0','240-242 Đường 3/2, Phường 12, Quận 10',600000,300000,1,'Sân khấu kịch chuyên nghiệp, dàn diễn viên hàng đầu Việt Nam','https://th.bing.com/th/id/R.006ffcc17105dad5f10e15824b2d90a8?rik=1ArzLpsMd%2bZFTg&pid=ImgRaw&r=0','Idecaf','https://www.who.int/images/default-source/wpro/countries/hong-kong-sar/h-54569767.tmb-1920v.jpg?Culture=en&sfvrsn=263efbeb_3','{\"customUrl\":\"da-co-hoai-lang\",\"privacy\":\"public\"}','2026-12-01 19:30:00.000000','PUBLISHED','https://i.pinimg.com/736x/66/ab/ee/66abeecfd6544ce635494d14a2c6f932--festival-photos.jpg','Kịch: Dạ Cổ Hoài Lang',3000,'2026-05-22 10:55:16.000000',6780,3),(8,15000,'MUSIC',1,'Hồ Chí Minh','2026-05-22 10:55:16.000000','Lễ hội âm nhạc điện tử nước theo phong cách quốc tế. DJ lineup từ các nước Nhật, Hàn Quốc, Thái Lan cùng DJ Việt. Tuy nhiên sự kiện đã bị hủy do vấn đề kỹ thuật.','2026-05-16 02:00:00.000000','https://tse4.mm.bing.net/th/id/OIP.hOij5nn2fnDf1pYUAOXh9wHaEo?rs=1&pid=ImgDetMain&o=7&rm=3',_binary '\0','202 Hoàng Văn Thụ, Phường 9, Phú Nhuận',1000000,500000,1,'Tổ chức sự kiện EDM chuyên nghiệp, có kinh nghiệm tổ chức festivals lớn','https://tse2.mm.bing.net/th/id/OIP.5WHqOuwo42aPuwM_SON8uQHaEo?rs=1&pid=ImgDetMain&o=7&rm=3','Watera VN','https://img.etimg.com/thumb/msid-102024023,width-1200,height-630,imgsize-37822,overlay-economictimes/articleshow.jpg','{\"customUrl\":\"watera\",\"privacy\":\"public\"}','2026-05-15 16:00:00.000000','CANCELLED','https://tse3.mm.bing.net/th/id/OIP.ttxjqJXvhNF0WbCDmjyXYwHaEM?rs=1&pid=ImgDetMain&o=7&rm=3','EDM Watera Festival',15000,'2026-05-22 10:55:16.000000',12340,1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizer_payment_infos`
--

DROP TABLE IF EXISTS `organizer_payment_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizer_payment_infos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_number` varchar(40) NOT NULL,
  `account_owner` varchar(120) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bank_branch` varchar(120) DEFAULT NULL,
  `bank_name` varchar(120) NOT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_bpmgwf9r2fwmh6jxqr47sxo6` (`event_id`),
  CONSTRAINT `FK4vdvcpgbf59wc1gqrlh03x0s` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizer_payment_infos`
--

LOCK TABLES `organizer_payment_infos` WRITE;
/*!40000 ALTER TABLE `organizer_payment_infos` DISABLE KEYS */;
INSERT INTO `organizer_payment_infos` VALUES (1,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',1),(2,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',2),(3,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',3),(4,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',4),(5,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',5),(6,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',6),(7,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',7),(8,'338858196','TRAN VAN HAU','218 Lý Thường Kiệt','Dĩ An','MBBank','0354678',8);
/*!40000 ALTER TABLE `organizer_payment_infos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method_config_params`
--

DROP TABLE IF EXISTS `payment_method_config_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method_config_params` (
  `payment_method_id` varchar(64) NOT NULL,
  `config_value` varchar(500) DEFAULT NULL,
  `config_key` varchar(100) NOT NULL,
  PRIMARY KEY (`payment_method_id`,`config_key`),
  CONSTRAINT `FK3omueax2yxmleosvre0lalywj` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method_config_params`
--

LOCK TABLES `payment_method_config_params` WRITE;
/*!40000 ALTER TABLE `payment_method_config_params` DISABLE KEYS */;
INSERT INTO `payment_method_config_params` VALUES ('MOMO_SANDBOX','vi','lang'),('MOMO_SANDBOX','sandbox','mode'),('MOMO_SANDBOX','payWithATM','requestType'),('VNPAY_SANDBOX','VND','currCode'),('VNPAY_SANDBOX','vn','locale'),('VNPAY_SANDBOX','sandbox','mode'),('VNPAY_SANDBOX','other','orderType');
/*!40000 ALTER TABLE `payment_method_config_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` varchar(64) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `is_available` bit(1) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `processor_type` enum('CreditCardProcessor','FreeProcessor','MoMoProcessor','ShopeePayProcessor','VNPayProcessor','VietQRProcessor','ZaloPayProcessor') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjhxemdv16lp2db66pk15qu3js` (`display_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES ('FREE','Mien phi',_binary '',NULL,'FreeProcessor'),('MOMO_SANDBOX','MoMo Sandbox',_binary '','https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png','MoMoProcessor'),('VNPAY_SANDBOX','VNPay Sandbox',_binary '','https://sandbox.vnpayment.vn/favicon.ico','VNPayProcessor');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(19,2) NOT NULL,
  `event_id` bigint NOT NULL,
  `event_performance_id` bigint NOT NULL,
  `fee_amount` decimal(19,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `organizer_amount` decimal(19,2) NOT NULL,
  `payment_token` varchar(255) DEFAULT NULL,
  `status` enum('COMPLETED','FAILED','PENDING','REFUNDED') NOT NULL,
  `payment_method_id` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKce1n8pa67lq4l57l9mhugdgab` (`payment_method_id`),
  CONSTRAINT `FKce1n8pa67lq4l57l9mhugdgab` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2800000.00,3000000001,4000000001,42000.00,1,2758000.00,'9cba7b9f-5d98-4ee3-83bc-7b5143c0bd3e','COMPLETED','MOMO_SANDBOX'),(2,800000.00,3000000001,4000000001,12000.00,2,788000.00,'11434b47-4455-4a0e-ac05-9841b411bf3d','PENDING','VNPAY_SANDBOX');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payouts`
--

DROP TABLE IF EXISTS `payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payouts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(19,2) NOT NULL,
  `evidence_url` varchar(500) DEFAULT NULL,
  `status` enum('FAILED','PENDING','PROCESSED') NOT NULL,
  `organizer_payment_info_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhwmr3442kal8bp31dji0fqrgo` (`organizer_payment_info_id`),
  CONSTRAINT `FKp319mfqosorhv56sr38si1nk4` FOREIGN KEY (`organizer_payment_info_id`) REFERENCES `organizer_payment_infos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) NOT NULL,
  `revoked` bit(1) NOT NULL,
  `token` varchar(500) NOT NULL,
  `account_user_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  KEY `FK4pf0pr04jp05h0aamck41ko4t` (`account_user_name`),
  CONSTRAINT `FK4pf0pr04jp05h0aamck41ko4t` FOREIGN KEY (`account_user_name`) REFERENCES `accounts` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'2026-05-29 10:38:12.506261',_binary '','2c649e2c-1398-4522-a4f8-3f3ad49a5228','dongcao'),(2,'2026-05-29 10:38:26.532199',_binary '','bbb79d66-6c1d-4a2e-abfc-0df36c6f4180','dongcao'),(3,'2026-05-29 10:40:23.444225',_binary '','568273bf-a055-47f3-8c5b-1e851cb31b92','dongcao'),(4,'2026-05-29 10:40:52.374432',_binary '\0','3263e4ed-6bde-4ed8-8e6b-37d6cc5f2e6e','dongcao'),(5,'2026-05-29 10:52:29.889798',_binary '\0','4ea4c4cd-60ab-435e-afae-91ea82d3e02a','admin_user'),(6,'2026-05-29 14:21:14.436153',_binary '\0','72aae675-3c52-4edb-a771-40a042b835bd','admin_user'),(7,'2026-05-29 14:29:18.778364',_binary '\0','ec985f23-154d-4c99-afcd-09e1285bca00','admin_user'),(8,'2026-05-29 14:50:31.059756',_binary '\0','a4c5bba0-c599-4298-b52d-5c48c0fa7c8b','admin_user');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_types`
--

DROP TABLE IF EXISTS `ticket_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `max_tickets_per_user` int NOT NULL,
  `min_tickets_per_user` int NOT NULL DEFAULT '1',
  `name` varchar(50) NOT NULL,
  `performance_id` bigint NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `reserved_quantity` int DEFAULT '0',
  `sale_end` datetime(6) NOT NULL,
  `sale_start` datetime(6) NOT NULL,
  `sold_quantity` int DEFAULT '0',
  `total_quantity` int NOT NULL,
  `version` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FKjl4qg7lrgtlnv5o1uyw41emws` (`performance_id`),
  CONSTRAINT `FKjl4qg7lrgtlnv5o1uyw41emws` FOREIGN KEY (`performance_id`) REFERENCES `event_performances` (`id`),
  CONSTRAINT `ticket_types_chk_1` CHECK ((`price` >= 0)),
  CONSTRAINT `ticket_types_chk_2` CHECK ((`reserved_quantity` >= 0)),
  CONSTRAINT `ticket_types_chk_3` CHECK ((`sold_quantity` >= 0)),
  CONSTRAINT `ticket_types_chk_4` CHECK ((`total_quantity` > 0)),
  CONSTRAINT `ticket_types_chk_5` CHECK ((`sale_start` < `sale_end`))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_types`
--

LOCK TABLES `ticket_types` WRITE;
/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
INSERT INTO `ticket_types` (
  id,
  max_tickets_per_user,
  name,
  performance_id,
  price,
  reserved_quantity,
  sale_end,
  sale_start,
  sold_quantity,
  total_quantity,
  version
) VALUES (1,2,'Vé VIP',1,2000000.00,0,'2026-06-14 23:59:59.000000','2026-05-01 09:00:00.000000',0,2000,0),(2,4,'Vé GA',1,800000.00,0,'2026-06-14 23:59:59.000000','2026-05-01 09:00:00.000000',0,8000,0),(3,2,'Vé VIP',2,2000000.00,0,'2026-06-15 23:59:59.000000','2026-05-01 09:00:00.000000',0,2000,0),(4,4,'Vé GA',2,800000.00,0,'2026-06-15 23:59:59.000000','2026-05-01 09:00:00.000000',0,8000,0),(5,1,'Vé Standard',3,0.00,0,'2026-07-09 12:00:00.000000','2026-06-01 08:00:00.000000',0,800,0),(6,2,'Vé Business',3,1000000.00,0,'2026-07-09 12:00:00.000000','2026-06-01 08:00:00.000000',0,200,0),(7,4,'Vé Thường',4,250000.00,0,'2026-08-19 20:00:00.000000','2026-07-01 10:00:00.000000',0,1800,0),(8,2,'Vé VIP',4,500000.00,0,'2026-08-19 20:00:00.000000','2026-07-01 10:00:00.000000',0,200,0),(9,4,'Vé Đồng Âm',5,750000.00,0,'2026-10-09 23:59:59.000000','2026-08-01 00:00:00.000000',0,35000,0),(10,2,'Vé VIP',5,1500000.00,0,'2026-10-09 23:59:59.000000','2026-08-01 00:00:00.000000',0,5000,0),(11,1,'Vé Sinh Viên',6,0.00,0,'2026-09-04 18:00:00.000000','2026-08-01 09:00:00.000000',0,100,0),(12,1,'BIB 5KM',7,200000.00,0,'2026-11-15 23:59:59.000000','2026-09-01 00:00:00.000000',0,3000,0),(13,1,'BIB 10KM',7,350000.00,0,'2026-11-15 23:59:59.000000','2026-09-01 00:00:00.000000',0,2000,0),(14,4,'Ghế Thường',8,300000.00,0,'2026-11-30 18:00:00.000000','2026-11-01 09:00:00.000000',0,1000,0),(15,4,'Ghế VIP',8,600000.00,0,'2026-11-30 18:00:00.000000','2026-11-01 09:00:00.000000',0,500,0),(16,4,'Ghế Thường',9,300000.00,0,'2026-12-01 18:00:00.000000','2026-11-01 09:00:00.000000',0,1000,0),(17,4,'Ghế VIP',9,600000.00,0,'2026-12-01 18:00:00.000000','2026-11-01 09:00:00.000000',0,500,0);
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `check_in_at` datetime(6) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `performance_id` bigint NOT NULL,
  `price_at_purchase` decimal(38,2) NOT NULL,
  `qr_code` varchar(255) NOT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `ticket_status` enum('CANCELLED','EXPIRED','PAID','PENDING','REFUNDED','USED') NOT NULL,
  `user_id` bigint NOT NULL,
  `ticket_type_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK136k8tqvcn833mi3tjgqktnx2` (`qr_code`),
  KEY `FKotik7mbbb14hu8n9og7o92k5h` (`ticket_type_id`),
  CONSTRAINT `FKotik7mbbb14hu8n9og7o92k5h` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`),
  CONSTRAINT `tickets_chk_1` CHECK ((`price_at_purchase` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,NULL,1,1,2000000.00,'6fdaf619-e13c-4ad1-abd4-d648a06b4466',NULL,'PAID',4,1),(2,NULL,1,1,800000.00,'632a9553-1445-49c9-9d5f-17f498712f56',NULL,'PAID',4,2),(3,NULL,2,1,800000.00,'022ffda7-77f3-4a9b-944d-bb648d058464',NULL,'PENDING',2,2);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` varchar(64) NOT NULL,
  `provider_response` text,
  `provider_transaction_id` varchar(120) DEFAULT NULL,
  `status` enum('FAILED','INIT','SUCCESS') NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `payment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcb9io0lhloy7l77hp891xmxkg` (`provider_transaction_id`),
  KEY `FKmt44qv8av8abvaqb5nbhjnmi2` (`payment_id`),
  CONSTRAINT `FKmt44qv8av8abvaqb5nbhjnmi2` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('906f21ac-04f5-4e9d-a6a2-8216326516f0','{\"partnerCode\":\"MOMOLRJZ20181206\",\"orderId\":\"MOMO-PAY1-81D921E8\",\"requestId\":\"3c8c4654-7258-419d-91b6-5a5076155652\",\"amount\":2800000,\"responseTime\":1779446483721,\"message\":\"Thành công.\",\"resultCode\":0,\"payUrl\":\"https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT0xSSloyMDE4MTIwNnxNT01PLVBBWTEtODFEOTIxRTg&s=b2874d62be26f0b792895f8b91ed8ed56c35d0a1482e50021819797e8b90074c\"}',NULL,'INIT','2026-05-22 10:41:22.024595',1),('d6de02d2-54bf-4d5b-a591-16ae8fc2a33e','{\"phase\":\"INIT\",\"sandbox\":true,\"paymentUrl\":\"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=80000000&vnp_Command=pay&vnp_CreateDate=20260522214210&vnp_CurrCode=VND&vnp_ExpireDate=20260522215710&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=PaymentPAY-2-E6F87241&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Flocalhost%3A8443%2Fpayment%2Fcall-back&vnp_TmnCode=YTPQFOOX&vnp_TxnRef=PAY-2-E6F87241&vnp_Version=2.1.0&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=6f4a30ad385c6499da9fd55b7488561491afe98fdd55470076cf4ba5f716ba6b77a885418ac574c0ee5bd3bc7ec4255b4e1d38f546c36d1bd1905eccb2761ad6\",\"txnRef\":\"PAY-2-E6F87241\"}',NULL,'INIT','2026-05-22 14:42:10.289795',2),('e8fa81f4-dbe4-4b75-b7c7-813ebfcca971','{\"partnerCode\":\"MOMOLRJZ20181206\",\"requestId\":\"3c8c4654-7258-419d-91b6-5a5076155652\",\"orderId\":\"MOMO-PAY1-81D921E8\",\"amount\":\"2800000\",\"resultCode\":0,\"message\":\"Successful.\",\"orderInfo\":\"Thanh toan don hang #1\",\"orderType\":\"momo_wallet\",\"transId\":\"4751998783\",\"responseTime\":\"1779446527303\",\"payType\":\"napas\",\"extraData\":\"cGF5bWVudElkPTEmcGF5bWVudFRva2VuPTljYmE3YjlmLTVkOTgtNGVlMy04M2JjLTdiNTE0M2MwYmQzZQ==\",\"signature\":\"1fd70a060af8e09b47823b61e184235b11066dc24e4c05bb8d2a8ed0fae44a20\",\"rawResponse\":null}','4751998783','SUCCESS','2026-05-22 10:42:06.225356',1);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(500) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `account_user_name` varchar(50) NOT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_c2b89l8mlfpjkqv4qnusx8hkw` (`account_user_name`),
  CONSTRAINT `FKrul35xefey6soyjwqej1gfury` FOREIGN KEY (`account_user_name`) REFERENCES `accounts` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'https://example.com/avatar-hau.jpg','Hồ Chí Minh','Trần Văn Hậu','0901234567','tran_van_hau',NULL),(2,NULL,'Hà Nội','Admin User','0909876543','admin_user',NULL),(3,'https://example.com/avatar-organizer.jpg','Hồ Chí Minh','Event Organizer','0902345678','event_organizer',NULL),(4,NULL,NULL,'Dong Cao','09876543210','dongcao',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `seat_map_config` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'202 Hoàng Văn Thụ, Phường 9, Phú Nhuận','Hồ Chí Minh','Sân Vận Động Quân Khu 7','{\"zones\": [\"VIP\", \"GA\"]}'),(2,'Cổng số 1, Đại lộ Thăng Long, Mễ Trì','Hà Nội','Trung Tâm Hội Nghị Quốc Gia','{\"zones\": [\"Hội trường lớn\"]}'),(3,'240-242 Đường 3/2, Phường 12, Quận 10','Hồ Chí Minh','Nhà Hát Hòa Bình','{\"zones\": [\"Tầng 1\", \"Tầng 2\"]}'),(4,'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm','Hà Nội','Sân Vận Động Quốc Gia Mỹ Đình','{\"zones\": [\"Khán đài A\", \"Khán đài B\"]}'),(5,'8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1','Hồ Chí Minh','Gem Center','{\"zones\": [\"Sảnh Castor\"]}'),(6,'12 Trịnh Hoài Đức, Cát Linh, Đống Đa','Hà Nội','Nhà Thi Đấu Trịnh Hoài Đức','{\"zones\": [\"Khu vực thi đấu\"]}');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ticketbox'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
-- /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
-- /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
-- /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 22:11:27



-- ==============================================================================

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


-- ==============================================================================

-- ==============================================================================
-- THỨ TỰ CHẠY SCRIPT: BƯỚC 3 (Bổ sung 50 sự kiện mẫu chất lượng cao)
-- ==============================================================================
-- BỔ SUNG DỮ LIỆU SỰ KIỆN MẪU CHO TICKETBOX
-- Bao gồm: 5 Địa điểm mới (Venues)
--          50 Sự kiện (Events) [10 cái cũ + 40 cái mới]
--          50 Suất diễn (Performances) [10 cái cũ + 40 cái mới]
--          100 Loại vé (Ticket Types) [20 cái cũ + 80 cái mới]
-- ==============================================================================

USE `ticketbox`;

-- 0. Bổ sung 5 Địa điểm mới (Venues)
LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT IGNORE INTO `venues` (`id`, `address`, `city`, `name`, `seat_map_config`) VALUES
(7, 'Đường Trần Hưng Đạo, Quận Sơn Trà', 'Đà Nẵng', 'Công Viên Kỳ Bác Đà Nẵng', '{"zones": ["Khu A", "Khu B"]}'),
(8, 'Phường 1, Thành phố Đà Lạt', 'Đà Lạt', 'Quảng Trường Lâm Viên', '{"zones": ["Khu khán đài", "Khu đứng GA"]}'),
(9, 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 'Nha Trang', 'Quảng Trường 2 Tháng 4', '{"zones": ["GA", "VIP"]}'),
(10, 'Lưu Hữu Phước, Ninh Kiều', 'Cần Thơ', 'Nhà Hát Tây Đô', '{"zones": ["Khán đài", "VIP"]}'),
(11, '17 Lạch Tray, Ngô Quyền', 'Hải Phòng', 'Sân Vận Động Lạch Tray', '{"zones": ["Khán đài A", "Khán đài B"]}');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;

-- 1. Bổ sung 50 Sự kiện mới (Events)
LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT IGNORE INTO `events` (`id`, `available_tickets`, `category`, `category_id`, `city`, `created_at`, `description`, `end_time`, `image_url`, `is_featured`, `location`, `max_price`, `min_price`, `organizer_id`, `organizer_info`, `organizer_logo`, `organizer_name`, `poster_url`, `settings_config`, `start_time`, `status`, `thumbnail_url`, `title`, `total_tickets`, `updated_at`, `view_count`, `venue_id`) VALUES 
(9, 3000, 'COMEDY', 7, 'Hồ Chí Minh', '2026-05-23 08:00:00.000000', 'Trấn Thành Live Comedy Show với những tiểu phẩm hài đặc sắc nhất, quy tụ dàn nghệ sĩ khách mời đình đám. Mang lại tiếng cười bùng nổ cho cuối tuần của bạn.', '2026-07-25 23:00:00.000000', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1200&auto=format&fit=crop', b'1', '240-242 Đường 3/2, Phường 12, Quận 10', 1500000, 500000, 1, 'Trấn Thành Town', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', 'Trấn Thành Town', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-25 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=400&auto=format&fit=crop', 'Trấn Thành Live Comedy 2026', 3000, '2026-05-23 08:00:00.000000', 45210, 3),
(10, 25000, 'MUSIC', 1, 'Hà Nội', '2026-05-23 09:15:00.000000', 'Sơn Tùng M-TP Sky Tour trở lại bùng nổ tại sân vận động Mỹ Đình. Sân khấu hoành tráng nhất lịch sử với hệ thống âm thanh ánh sáng chuẩn quốc tế.', '2026-09-02 23:30:00.000000', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop', b'1', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 3000000, 800000, 1, 'M-TP Entertainment - Công ty giải trí hàng đầu', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200', 'M-TP Entertainment', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-02 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop', 'Sky Tour M-TP 2026', 25000, '2026-05-23 09:15:00.000000', 120500, 4),
(11, 500, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-23 10:00:00.000000', 'Marketing 5.0 - Áp dụng AI vào chiến dịch Marketing thực chiến. Diễn giả từ Google, Meta và TikTok Việt Nam.', '2026-08-15 17:00:00.000000', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 2000000, 1000000, 1, 'Tomorrow Marketers Academy', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Tomorrow Marketers', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 08:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=400&auto=format&fit=crop', 'Hội Nghị: Marketing 5.0 & AI', 500, '2026-05-23 10:00:00.000000', 3200, 5),
(12, 1000, 'THEATER', 5, 'Hà Nội', '2026-05-23 11:20:00.000000', 'Vở diễn Múa Rối Nước "Làng Tôi" khắc họa bức tranh đồng quê Việt Nam sống động, với kỹ xảo sân khấu hiện đại kết hợp truyền thống.', '2026-07-20 22:00:00.000000', 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 500000, 200000, 1, 'Nhà hát Múa Rối Trung Ương', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'Nhà Hát Múa Rối', 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-20 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=400&auto=format&fit=crop', 'Múa Rối: Làng Tôi', 1000, '2026-05-23 11:20:00.000000', 8900, 2),
(13, 3000, 'SPORTS', 6, 'Hà Nội', '2026-05-23 14:00:00.000000', 'Chung kết Bóng Rổ VBA 2026. Trận đấu nghẹt thở quyết định ngôi vô địch giữa Hanoi Buffaloes và Saigon Heat.', '2026-11-05 22:30:00.000000', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop', b'1', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 1500000, 300000, 1, 'Vietnam Basketball Association', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'VBA Official', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-05 19:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop', 'Chung Kết VBA 2026', 3000, '2026-05-23 14:00:00.000000', 21450, 6),
(14, 5000, 'EXHIBITION', 2, 'Hồ Chí Minh', '2026-05-23 15:30:00.000000', 'Triển lãm Nghệ Thuật Số Đa Giác Quan Van Gogh. Đắm chìm trong không gian hội họa đỉnh cao qua công nghệ trình chiếu 3D mapping.', '2026-12-31 22:00:00.000000', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1200&auto=format&fit=crop', b'1', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 350000, 250000, 1, 'Art Society VN', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=200', 'Art Society', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-01 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Van Gogh 3D', 5000, '2026-05-23 15:30:00.000000', 67000, 5),
(15, 10000, 'FESTIVAL', 3, 'Hồ Chí Minh', '2026-05-23 16:45:00.000000', 'Lễ hội Văn Hóa Ẩm Thực Châu Á 2026. Thưởng thức 100+ món ăn đường phố từ Hàn Quốc, Nhật Bản, Thái Lan và Việt Nam.', '2026-10-15 23:00:00.000000', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop', b'0', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 150000, 50000, 1, 'Asian Food Tour', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200', 'Food Tour VN', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-12 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Ẩm Thực Châu Á', 10000, '2026-05-23 16:45:00.000000', 12300, 1),
(16, 4000, 'MUSIC', 1, 'Hà Nội', '2026-05-23 17:10:00.000000', 'Hà Anh Tuấn Live Concert - Chân Trời Rực Rỡ. Đêm nhạc acoustic lãng mạn cùng dàn nhạc giao hưởng, tri ân khán giả thủ đô.', '2026-11-20 23:30:00.000000', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1200&auto=format&fit=crop', b'1', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 4000000, 1200000, 1, 'Viet Vision', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', 'Viet Vision', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-20 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=400&auto=format&fit=crop', 'Hà Anh Tuấn - Chân Trời Rực Rỡ', 4000, '2026-05-23 17:10:00.000000', 56700, 2),
(17, 800, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-23 18:20:00.000000', 'Sự kiện Networking & Gọi Vốn: Khởi nghiệp cùng Shark. Cơ hội thuyết trình dự án trực tiếp trước các quỹ đầu tư lớn.', '2026-09-10 18:00:00.000000', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 500000, 200000, 1, 'Startup Vietnam Foundation', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=200', 'Startup Foundation', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-10 08:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=400&auto=format&fit=crop', 'Khởi Nghiệp Cùng Shark', 800, '2026-05-23 18:20:00.000000', 4500, 5),
(18, 1500, 'COMEDY', 7, 'Hồ Chí Minh', '2026-05-23 19:00:00.000000', 'Sài Gòn Tếu Live: Độc Thoại Sài Gòn Có Gì Vui? Đêm hài độc thoại (Stand-up Comedy) cực chất từ nhóm hài đình đám Sài Gòn Tếu.', '2026-08-30 22:30:00.000000', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=1200&auto=format&fit=crop', b'0', '240-242 Đường 3/2, Phường 12, Quận 10', 450000, 250000, 1, 'Sài Gòn Tếu', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?w=200', 'Sài Gòn Tếu', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-30 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=400&auto=format&fit=crop', 'Sài Gòn Tếu: Sài Gòn Có Gì Vui', 1500, '2026-05-23 19:00:00.000000', 18900, 3),
(19, 2000, 'MUSIC', 1, 'Đà Lạt', '2026-05-23 20:00:00.000000', 'Đại nhạc hội Chill & Flow giữa rừng thông Đà Lạt. Lắng nghe những bản tình ca acoustic ngọt ngào từ các ca sĩ hàng đầu trong không gian thơ mộng đầy sương mù.', '2026-10-10 22:00:00.000000', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', b'1', 'Quảng Trường Lâm Viên, Phường 1, Đà Lạt', 1500000, 400000, 1, 'Mây Lang Thang Group', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200', 'Mây Lang Thang', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-10 18:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop', 'Chill & Flow Concert Đà Lạt 2026', 2000, '2026-05-23 20:00:00.000000', 12500, 8),
(20, 5000, 'FESTIVAL', 3, 'Đà Nẵng', '2026-05-23 20:15:00.000000', 'Lễ hội khinh khí cầu quốc tế Đà Nẵng 2026. Hàng trăm khinh khí cầu rực rỡ sắc màu bay lượn trên bầu trời sông Hàn, kết hợp biểu diễn nhạc EDM hoàng tráng.', '2026-08-09 23:00:00.000000', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', b'1', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 300000, 100000, 1, 'Đà Nẵng Events', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200', 'Đà Nẵng Events', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-08 17:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Khinh Khí Cầu Đà Nẵng 2026', 5000, '2026-05-23 20:15:00.000000', 34200, 7),
(21, 1000, 'COMEDY', 7, 'Hà Nội', '2026-05-23 20:30:00.000000', 'Hài kịch Đời Cười 2026 của Nhà hát Tuổi Trẻ. Những tiểu phẩm hài châm biếm sâu sắc, mang lại những tràng cười sảng khoái và ý nghĩa nhân văn sâu sắc.', '2026-07-15 22:30:00.000000', 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 800000, 200000, 1, 'Nhà hát Tuổi Trẻ Hà Nội', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?w=200', 'Nhà Hát Tuổi Trẻ', 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-15 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=400&auto=format&fit=crop', 'Hài Kịch: Đời Cười 2026', 1000, '2026-05-23 20:30:00.000000', 5800, 2),
(22, 1200, 'THEATER', 5, 'Hồ Chí Minh', '2026-05-23 20:45:00.000000', 'Vở nhạc kịch huyền thoại thế giới Les Misérables (Những Người Khốn Khổ) được dàn dựng nghệ thuật và biểu diễn bởi dàn nhạc và nghệ sĩ opera hàng đầu.', '2026-11-20 22:30:00.000000', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop', b'1', '240-242 Đường 3/2, Phường 12, Quận 10', 2500000, 500000, 1, 'Saigon Broadway Company', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200', 'Saigon Broadway', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-20 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=400&auto=format&fit=crop', 'Nhạc Kịch: Les Misérables 2026', 1200, '2026-05-23 20:45:00.000000', 16500, 3),
(23, 3000, 'SPORTS', 6, 'Đà Nẵng', '2026-05-23 21:00:00.000000', 'Giải chạy Marathon Quốc tế Đà Nẵng 2026. Cung đường chạy tuyệt vời ven biển Sơn Trà - Mỹ Khê, cơ hội chinh phục những thử thách điền kinh đỉnh cao.', '2026-09-12 11:00:00.000000', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 800000, 300000, 1, 'Pulse Active Vietnam', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200', 'Pulse Active', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-12 04:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=400&auto=format&fit=crop', 'Đà Nẵng International Marathon 2026', 3000, '2026-05-23 21:00:00.000000', 8900, 7),
(24, 500, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-23 21:15:00.000000', 'Hội thảo tài chính chuyên sâu về quản lý danh mục đầu tư và tối ưu thuế trong nền kinh tế toàn cầu nhiều biến động hiện nay.', '2026-07-18 12:00:00.000000', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 1500000, 500000, 1, 'VnDirect Investment Academy', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200', 'VnDirect Academy', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-18 08:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format&fit=crop', 'Hội Thảo: Tài Chính Cá Nhân 2026', 500, '2026-05-23 21:15:00.000000', 4300, 5),
(25, 800, 'EXHIBITION', 2, 'Hà Nội', '2026-05-23 21:30:00.000000', 'Triển lãm mỹ thuật sơn mài truyền thống kết hợp công nghệ ánh sáng 3D mapping mang tên Hồn Xưa Nét Cũ cực kỳ hoành tráng.', '2026-08-10 18:00:00.000000', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 250000, 100000, 1, 'Vietnam Fine Arts Association', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200', 'Art Council VN', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-01 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Tranh: Hồn Xưa Nét Cũ', 800, '2026-05-23 21:30:00.000000', 14500, 2),
(26, 1500, 'OTHER', 8, 'Hồ Chí Minh', '2026-05-23 21:45:00.000000', 'Đêm nhạc trữ tình quy mô đẳng cấp của ca sĩ Lệ Quyên. Hãy đắm chìm vào các ca khúc Bolero lãng mạn bất hủ vang bóng một thời.', '2026-09-25 23:00:00.000000', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop', b'1', '240-242 Đường 3/2, Phường 12, Quận 10', 3000000, 800000, 1, 'Lệ Quyên Entertainment Ltd.', 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200', 'Lệ Quyên Town', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-25 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop', 'Concert Lệ Quyên: Đêm Tình Nhân', 1500, '2026-05-23 21:45:00.000000', 21300, 3),
(27, 4000, 'FESTIVAL', 3, 'Hồ Chí Minh', '2026-05-23 22:00:00.000000', 'Trải nghiệm lễ hội bia truyền thống mang đúng phong vị Munich nước Đức, kết hợp các ban nhạc rock Đức-Việt biểu diễn trực tiếp.', '2026-10-17 23:00:00.000000', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop', b'0', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 600000, 250000, 1, 'German Business Association Vietnam', 'https://images.unsplash.com/photo-1550136555-5f59c2efab22?w=200', 'GBA Vietnam', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-15 17:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Bia Đức Oktoberfest 2026', 4000, '2026-05-23 22:00:00.000000', 18600, 1),
(28, 15000, 'MUSIC', 1, 'Hà Nội', '2026-05-23 22:15:00.000000', 'Đại hội nhạc trẻ K-POP hoành tráng nhất với sự góp mặt của các nhóm nhạc xu hướng đến từ Hàn Quốc tại SVĐ Quốc gia Mỹ Đình.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop', b'1', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 5000000, 1200000, 1, 'ShowVN Entertainment Vietnam', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200', 'ShowVN Company', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop', 'K-POP Super Concert Hanoi 2026', 15000, '2026-05-23 22:15:00.000000', 98000, 4),
(29, 800, 'THEATER', 5, 'Hà Nội', '2026-05-23 22:30:00.000000', 'Vở kịch kinh điển "Hồn Trương Ba Da Hàng Thịt" được dàn dựng chỉnh chu, chỉn chu với lối diễn xuất nội lực sâu lắng từ các nghệ sĩ nhân dân.', '2026-07-28 22:30:00.000000', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 500000, 150000, 1, 'Nhà hát Kịch Việt Nam', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200', 'Nhà Hát Kịch VN', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-28 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=400&auto=format&fit=crop', 'Kịch: Hồn Trương Ba Da Hàng Thịt', 800, '2026-05-23 22:30:00.000000', 4900, 2),
(30, 2000, 'SPORTS', 6, 'Hồ Chí Minh', '2026-05-23 22:45:00.000000', 'Các trận so găng kịch tính tranh đai vô địch Boxing chuyên nghiệp toàn quốc hội tụ tinh hoa võ thuật của nước nhà.', '2026-10-24 22:30:00.000000', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop', b'0', '240-242 Đường 3/2, Phường 12, Quận 10', 1000000, 200000, 1, 'Liên đoàn Boxing Việt Nam (VBF)', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200', 'Vietnam Boxing', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-24 19:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400&auto=format&fit=crop', 'Giải Vô Địch Boxing Quốc Gia 2026', 2000, '2026-05-23 22:45:00.000000', 9200, 3),
(31, 100, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-23 23:00:00.000000', 'Không gian trải nghiệm cắm hoa Ikebana tinh tế kết hợp trà đạo thư thái giúp xua tan mệt mỏi và rèn luyện tâm hồn.', '2026-08-22 12:00:00.000000', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 600000, 350000, 1, 'Zen Art Club Saigon', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200', 'Zen Art Club', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-22 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop', 'Workshop: Trà Đạo & Hoa Ikebana', 100, '2026-05-23 23:00:00.000000', 950, 5),
(32, 3000, 'EXHIBITION', 2, 'Hồ Chí Minh', '2026-05-23 23:15:00.000000', 'Khám phá sự trỗi dậy của AI, thế giới thực tế ảo VR và robot tự động hóa thông minh bậc nhất hiện nay tại GEM Center.', '2026-12-07 18:00:00.000000', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 400000, 150000, 1, 'VCCI Ho Chi Minh Branch', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200', 'VCCI Vietnam', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-05 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Robot & AI Tech 2026', 3000, '2026-05-23 23:15:00.000000', 11300, 5),
(33, 600, 'COMEDY', 7, 'Đà Nẵng', '2026-05-23 23:30:00.000000', 'Đêm hài độc thoại hóm hỉnh cười thả ga cùng các diễn viên trẻ hài hước, đem đến những góc nhìn mới mẻ vui tươi.', '2026-08-15 22:00:00.000000', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 350000, 150000, 1, 'Đà Nẵng Tếu Comedy Club', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?w=200', 'Đà Nẵng Tếu', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop', 'Hài Độc Thoại: Cười Để Sống 2026', 600, '2026-05-23 23:30:00.000000', 3100, 7),
(34, 1000, 'MUSIC', 1, 'Hà Nội', '2026-05-23 23:45:00.000000', 'Lắng nghe kiệt tác giao hưởng Symphony No.9 nổi tiếng của nhà soạn nhạc thiên tài Beethoven biểu diễn cực kỳ lôi cuốn.', '2026-12-18 22:30:00.000000', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 2000000, 500000, 1, 'Vietnam Symphony Orchestra (VNSO)', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200', 'VNSO Orchestra', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-18 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop', 'Hòa Nhạc Giao Hưởng: Beethoven', 1000, '2026-05-23 23:45:00.000000', 7900, 4),
(35, 8000, 'FESTIVAL', 3, 'Nha Trang', '2026-05-24 08:00:00.000000', 'Mãn nhãn với màn trình diễn drone nghệ thuật rực rỡ sắc màu thắp sáng vịnh biển Nha Trang kết hợp âm nhạc EDM cực nhiệt.', '2026-07-30 23:00:00.000000', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', b'1', 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 400000, 100000, 1, 'Nha Trang Tourism Promotion Board', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200', 'Nha Trang Events', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-30 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Ánh Sáng Nha Trang Show', 8000, '2026-05-24 08:00:00.000000', 41200, 9),
(36, 1200, 'THEATER', 5, 'Hồ Chí Minh', '2026-05-24 08:15:00.000000', 'Vở cải lương kinh điển Tiếng Trống Mê Linh với kịch bản hào hùng của dân tộc Việt Nam được dàn dựng và biểu diễn đầy xúc cảm.', '2026-10-30 22:30:00.000000', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=1200&auto=format&fit=crop', b'0', '240-242 Đường 3/2, Phường 12, Quận 10', 1000000, 200000, 1, 'Nhà hát cải lương Trần Hữu Trang', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'Nhà Hát Trần Hữu Trang', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-30 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=400&auto=format&fit=crop', 'Cải Lương: Tiếng Trống Mê Linh', 1200, '2026-05-24 08:15:00.000000', 8700, 3),
(37, 5000, 'SPORTS', 6, 'Nha Trang', '2026-05-24 08:30:00.000000', 'Giải đua xe đạp cúp truyền hình chặng đua ven vịnh biển Nha Trang tuyệt đẹp, quy tụ hàng trăm tay đua cự phách tranh tài kịch tính.', '2026-08-25 11:30:00.000000', 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=1200&auto=format&fit=crop', b'0', 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 150000, 50000, 1, 'HTV Sports Đài Truyền Hình TP.HCM', 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=200', 'HTV Sports', 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-25 07:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=400&auto=format&fit=crop', 'Giải Đua Xe Đạp Quốc Tế Ven Biển', 5000, '2026-05-24 08:30:00.000000', 6500, 9),
(38, 400, 'WORKSHOP', 4, 'Đà Nẵng', '2026-05-24 08:45:00.000000', 'Hội thảo giao lưu kết nối startup, chia sẻ kinh nghiệm phát triển sản phẩm công nghệ đột phá và cơ hội nhận đầu tư lớn.', '2026-09-05 12:00:00.000000', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 800000, 300000, 1, 'Danang Innovation & Startup Hub', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200', 'Danang Startup Hub', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-05 08:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&auto=format&fit=crop', 'Hội Thảo: Startup & Angel Investment', 400, '2026-05-24 08:45:00.000000', 1200, 7),
-- 20 Sự kiện mới bổ sung (IDs 39 - 58)
(39, 3000, 'MUSIC', 1, 'Cần Thơ', '2026-05-24 09:00:00.000000', 'Đại Nhạc Hội EDM SoundWave Cần Thơ mang không khí lễ hội cuồng nhiệt đến với miền Tây sông nước, hệ thống âm thanh ánh sáng đỉnh cao.', '2026-10-20 23:00:00.000000', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', b'1', 'Lưu Hữu Phước, Ninh Kiều, Cần Thơ', 800000, 200000, 1, 'Can Tho SoundWave Co.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200', 'SoundWave Can Tho', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-20 19:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop', 'EDM SoundWave Cần Thơ 2026', 3000, '2026-05-24 09:00:00.000000', 11200, 10),
(40, 1000, 'THEATER', 5, 'Cần Thơ', '2026-05-24 09:15:00.000000', 'Vở cải lương kinh điển Đời Cô Lựu mang đầy tính nghệ thuật dân tộc Nam Bộ, tái hiện những góc khuất số phận người phụ nữ xưa.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=1200&auto=format&fit=crop', b'0', 'Lưu Hữu Phước, Ninh Kiều, Cần Thơ', 500000, 150000, 1, 'Tây Đô Theater Co.', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'Tây Đô Theater', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1503095391758-11200cf53674?q=80&w=400&auto=format&fit=crop', 'Kịch Cải Lương: Đời Cô Lựu', 1000, '2026-05-24 09:15:00.000000', 4500, 10),
(41, 5000, 'SPORTS', 6, 'Hải Phòng', '2026-05-24 09:30:00.000000', 'Giải Vô Địch Điền Kinh Hải Phòng 2026 quy tụ các vận động viên điền kinh xuất sắc nhất cạnh tranh kịch tính trên chảo lửa Lạch Tray.', '2026-09-15 17:00:00.000000', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1200&auto=format&fit=crop', b'0', '17 Lạch Tray, Ngô Quyền, Hải Phòng', 200000, 50000, 1, 'Hai Phong Sports Association', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200', 'HP Sports', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-15 08:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=400&auto=format&fit=crop', 'Giải Điền Kinh Hải Phòng 2026', 5000, '2026-05-24 09:30:00.000000', 6700, 11),
(42, 15000, 'FESTIVAL', 3, 'Hải Phòng', '2026-05-24 09:45:00.000000', 'Lễ hội hoa phượng đỏ Hải Phòng 2026 rực rỡ với các hoạt động diễu hành đường phố, triển lãm nghệ thuật và trình diễn pháo hoa.', '2026-06-10 23:00:00.000000', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop', b'1', '17 Lạch Tray, Ngô Quyền, Hải Phòng', 150000, 0, 1, 'Hải Phòng Tourism Authority', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200', 'Hai Phong Events', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-06-10 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Hoa Phượng Đỏ Hải Phòng', 15000, '2026-05-24 09:45:00.000000', 23400, 11),
(43, 12000, 'MUSIC', 1, 'Hồ Chí Minh', '2026-05-24 10:00:00.000000', 'Liveshow của nữ ca sĩ Mỹ Tâm tái xuất hoành tráng trong đêm nhạc Tri Âm đầy cảm xúc tại Sân Vận Động Quân Khu 7.', '2026-11-28 23:30:00.000000', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop', b'1', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 4000000, 800000, 1, 'MT Entertainment Co.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', 'MT Entertainment', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-28 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop', 'Liveshow Mỹ Tâm: Tri Âm Concert', 12000, '2026-05-24 10:00:00.000000', 145000, 1),
(44, 2000, 'MUSIC', 1, 'Hà Nội', '2026-05-24 10:15:00.000000', 'Đêm nhạc tưởng nhớ cố nhạc sĩ Trịnh Công Sơn với các giọng ca gạo cội trình diễn acoustic ấm áp tại Trung tâm hội nghị quốc gia.', '2026-09-18 22:30:00.000000', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 2500000, 500000, 1, 'Trinh Cong Son Foundation', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', 'Trịnh Sơn Music', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-18 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=400&auto=format&fit=crop', 'Đêm Nhạc Trịnh: Ru Tình 2026', 2000, '2026-05-24 10:15:00.000000', 8900, 2),
(45, 1500, 'COMEDY', 7, 'Hồ Chí Minh', '2026-05-24 10:30:00.000000', 'Liveshow hài kịch tụ hội các nhóm hài độc thoại Bắc Nam đình đám nhất hiện nay mang lại những góc nhìn dí dỏm cực đã.', '2026-09-30 22:30:00.000000', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=1200&auto=format&fit=crop', b'0', '240-242 Đường 3/2, Phường 12, Quận 10', 1000000, 300000, 1, 'Comedy VN Association', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?w=200', 'Comedy VN', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-30 20:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=400&auto=format&fit=crop', 'Đại Hội Hài Độc Thoại Bắc Nam', 1500, '2026-05-24 10:30:00.000000', 5300, 3),
(46, 1800, 'THEATER', 5, 'Hồ Chí Minh', '2026-05-24 10:45:00.000000', 'Nhạc kịch Broadway kinh điển The Phantom of the Opera lần đầu tiên được biểu diễn chuyên nghiệp hoàn chỉnh tại Việt Nam.', '2026-12-15 22:30:00.000000', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop', b'1', '240-242 Đường 3/2, Phường 12, Quận 10', 3500000, 800000, 1, 'Saigon Opera Group', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200', 'Saigon Opera', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=400&auto=format&fit=crop', 'Nhạc Kịch: The Phantom of the Opera', 1800, '2026-05-24 10:45:00.000000', 31200, 3),
(47, 600, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-24 11:00:00.000000', 'Hội thảo công nghệ hàng đầu cập nhật các xu hướng phát triển AI, học máy, ChatGPT và công cụ tối ưu cho kỹ sư phần mềm.', '2026-07-20 17:00:00.000000', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 1200000, 400000, 1, 'AI Vietnam Community', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'AI Vietnam', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-20 08:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=400&auto=format&fit=crop', 'Hội Thảo: Xu Hướng AI Tech 2026', 600, '2026-05-24 11:00:00.000000', 5100, 5),
(48, 10000, 'EXHIBITION', 2, 'Hồ Chí Minh', '2026-05-24 11:15:00.000000', 'Triển lãm ô tô quy mô lớn nhất Việt Nam quy tụ các hãng xe danh tiếng trưng bày siêu xe và xe điện thông minh đột phá.', '2026-10-25 18:00:00.000000', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1200&auto=format&fit=crop', b'1', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 300000, 100000, 1, 'VAMA Vietnam', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=200', 'VAMA Association', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-20 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Ô Tô: Vietnam Motor Show', 10000, '2026-05-24 11:15:00.000000', 38900, 5),
(49, 8000, 'FESTIVAL', 3, 'Hồ Chí Minh', '2026-05-24 11:30:00.000000', 'Thưởng thức ẩm thực đường phố ba miền đa dạng sắc màu văn hóa vùng miền tại không gian náo nhiệt SVĐ Quân Khu 7.', '2026-11-15 22:00:00.000000', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop', b'0', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 200000, 50000, 1, 'Saigon Food Tour Co.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200', 'Sài Gòn Foodie', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-12 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Ẩm Thực Đường Phố Sài Gòn', 8000, '2026-05-24 11:30:00.000000', 16500, 1),
(50, 2500, 'SPORTS', 6, 'Hà Nội', '2026-05-24 11:45:00.000000', 'Trận tranh tài bóng rổ đỉnh cao (VBA Derby) rực lửa giữa Saigon Heat và Hanoi Buffaloes tại nhà thi đấu Trịnh Hoài Đức.', '2026-09-05 22:00:00.000000', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop', b'1', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 1200000, 200000, 1, 'Vietnam Basketball League', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'VBA Official', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-05 19:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop', 'Bóng Rổ VBA: Saigon Heat vs Buffaloes', 2500, '2026-05-24 11:45:00.000000', 15400, 6),
(51, 1500, 'MUSIC', 1, 'Đà Lạt', '2026-05-24 12:00:00.000000', 'Đêm nhạc Acoustic nhẹ nhàng tinh tế lắng đọng tình yêu thương trong tiết trời se lạnh mộng mơ tại Quảng trường Lâm Viên.', '2026-10-25 22:30:00.000000', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', b'0', 'Phường 1, Thành phố Đà Lạt', 1200000, 300000, 1, 'Đà Lạt Sound Club', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200', 'Đà Lạt Chill', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-25 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop', 'Đêm Nhạc Acoustic: Lời Yêu Thương', 1500, '2026-05-24 12:00:00.000000', 7900, 8),
(52, 20000, 'FESTIVAL', 3, 'Đà Lạt', '2026-05-24 12:15:00.000000', 'Lễ hội hoa Đà Lạt 2026 rực rỡ sắc màu biến Quảng trường Lâm Viên thành rừng hoa nghệ thuật khổng lồ kết hợp âm nhạc.', '2026-12-25 23:00:00.000000', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop', b'1', 'Phường 1, Thành phố Đà Lạt', 200000, 0, 1, 'Lâm Đồng Tourism Promotion', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200', 'Dalat Flower Fest', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-20 08:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Hoa Đà Lạt Festival 2026', 20000, '2026-05-24 12:15:00.000000', 51000, 8),
(53, 1200, 'EXHIBITION', 2, 'Đà Nẵng', '2026-05-24 12:30:00.000000', 'Triển lãm tranh sơn dầu Sắc Màu Quê Hương trưng bày các họa phẩm xuất sắc về quê hương, con người miền Trung tại Công viên Kỳ Bác.', '2026-08-30 18:00:00.000000', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 150000, 50000, 1, 'Danang Fine Arts Association', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200', 'Fine Arts DN', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-25 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Tranh: Sắc Màu Quê Hương', 1200, '2026-05-24 12:30:00.000000', 3200, 7),
(54, 6000, 'MUSIC', 1, 'Nha Trang', '2026-05-24 12:45:00.000000', 'Bữa tiệc âm nhạc điện tử bãi biển Watera cực mát mẻ cuồng nhiệt, thắp sáng đêm hè sôi động trên vịnh biển Nha Trang xinh đẹp.', '2026-07-28 23:30:00.000000', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', b'1', 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 1500000, 400000, 1, 'Watera EDM Vietnam', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200', 'Watera Nha Trang', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-28 19:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop', 'Đại Nhạc Hội EDM Watera Nha Trang', 6000, '2026-05-24 12:45:00.000000', 21500, 9),
(55, 1200, 'THEATER', 5, 'Hà Nội', '2026-05-24 13:00:00.000000', 'Vở kịch nói Tấm Cám cổ tích được cải biên thời đại mới mang tiếng cười sâu sắc dí dỏm cùng những bài học làm người giá trị.', '2026-09-12 22:30:00.000000', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 400000, 150000, 1, 'Nhà hát Tuổi Trẻ Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200', 'Tuổi Trẻ Theater', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-12 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=400&auto=format&fit=crop', 'Vở Kịch: Tấm Cám Thời Đại Mới', 1200, '2026-05-24 13:00:00.000000', 6500, 2),
(56, 10000, 'SPORTS', 6, 'Đà Nẵng', '2026-05-24 13:15:00.000000', 'Mãn nhãn với giải đấu đua thuyền rồng quốc tế kịch tính rộn rã cờ hoa trên sông Hàn, biểu tượng thể thao văn hóa Đà Nẵng.', '2026-08-30 11:30:00.000000', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng', 100000, 0, 1, 'Danang Dragon Boat League', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'Dragon Boat DN', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-30 07:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop', 'Giải Đua Thuyền Rồng Quốc Tế Sông Hàn', 10000, '2026-05-24 13:15:00.000000', 8700, 7),
(57, 150, 'WORKSHOP', 4, 'Hà Nội', '2026-05-24 13:30:00.000000', 'Trải nghiệm tự tay xoay đất nặn gốm mộc mạc Bát Tràng truyền thống dưới sự hướng dẫn nhiệt tình của các nghệ nhân làng nghề.', '2026-09-06 12:00:00.000000', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 500000, 250000, 1, 'Bát Tràng Ceramic Club', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200', 'Bat Trang Club', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-06 09:00:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop', 'Workshop: Tự Tay Làm Gốm Bát Tràng', 150, '2026-05-24 13:30:00.000000', 1100, 2),
(58, 2000, 'OTHER', 8, 'Hồ Chí Minh', '2026-05-24 13:45:00.000000', 'Đêm hội thời trang Vietnam Fashion Week hội tụ các siêu mẫu, nhà thiết kế đẳng cấp trình diễn những bộ cánh lộng lẫy dẫn đầu xu hướng.', '2026-11-20 22:30:00.000000', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop', b'1', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 2000000, 500000, 1, 'Vietnam Fashion Council', 'https://images.unsplash.com/photo-1550136555-5f59c2efab22?w=200', 'Vietnam Fashion', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-20 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop', 'Vietnam Fashion Week 2026 Show', 2000, '2026-05-24 13:45:00.000000', 16700, 5);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

-- 2. Bổ sung 30 Suất diễn cho các Sự kiện trên (Performances)
LOCK TABLES `event_performances` WRITE;
/*!40000 ALTER TABLE `event_performances` DISABLE KEYS */;
INSERT IGNORE INTO `event_performances` (`id`, `available_capacity`, `end_time`, `start_time`, `status`, `total_capacity`, `event_id`, `venue_id`) VALUES
(11, 3000, '2026-07-25 23:00:00.000000', '2026-07-25 20:00:00.000000', 'OPEN', 3000, 9, 3),
(12, 25000, '2026-09-02 23:30:00.000000', '2026-09-02 19:30:00.000000', 'OPEN', 25000, 10, 4),
(13, 500, '2026-08-15 17:00:00.000000', '2026-08-15 08:30:00.000000', 'OPEN', 500, 11, 5),
(14, 1000, '2026-07-20 22:00:00.000000', '2026-07-20 20:00:00.000000', 'OPEN', 1000, 12, 2),
(15, 3000, '2026-11-05 22:30:00.000000', '2026-11-05 19:00:00.000000', 'OPEN', 3000, 13, 6),
(16, 5000, '2026-12-31 22:00:00.000000', '2026-12-01 09:00:00.000000', 'OPEN', 5000, 14, 5),
(17, 10000, '2026-10-15 23:00:00.000000', '2026-10-12 09:00:00.000000', 'OPEN', 10000, 15, 1),
(18, 4000, '2026-11-20 23:30:00.000000', '2026-11-20 20:00:00.000000', 'OPEN', 4000, 16, 2),
(19, 800, '2026-09-10 18:00:00.000000', '2026-09-10 08:30:00.000000', 'OPEN', 800, 17, 5),
(20, 1500, '2026-08-30 22:30:00.000000', '2026-08-30 20:00:00.000000', 'OPEN', 1500, 18, 3),
(21, 2000, '2026-10-10 22:00:00.000000', '2026-10-10 18:00:00.000000', 'OPEN', 2000, 19, 8),
(22, 5000, '2026-08-09 23:00:00.000000', '2026-08-08 17:00:00.000000', 'OPEN', 5000, 20, 7),
(23, 1000, '2026-07-15 22:30:00.000000', '2026-07-15 20:00:00.000000', 'OPEN', 1000, 21, 2),
(24, 1200, '2026-11-20 22:30:00.000000', '2026-11-20 19:30:00.000000', 'OPEN', 1200, 22, 3),
(25, 3000, '2026-09-12 11:00:00.000000', '2026-09-12 04:00:00.000000', 'OPEN', 3000, 23, 7),
(26, 500, '2026-07-18 12:00:00.000000', '2026-07-18 08:30:00.000000', 'OPEN', 500, 24, 5),
(27, 800, '2026-08-10 18:00:00.000000', '2026-08-01 09:00:00.000000', 'OPEN', 800, 25, 2),
(28, 1500, '2026-09-25 23:00:00.000000', '2026-09-25 20:00:00.000000', 'OPEN', 1500, 26, 3),
(29, 4000, '2026-10-17 23:00:00.000000', '2026-10-15 17:00:00.000000', 'OPEN', 4000, 27, 1),
(30, 15000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 15000, 28, 4),
(31, 800, '2026-07-28 22:30:00.000000', '2026-07-28 20:00:00.000000', 'OPEN', 800, 29, 2),
(32, 2000, '2026-10-24 22:30:00.000000', '2026-10-24 19:00:00.000000', 'OPEN', 2000, 30, 3),
(33, 100, '2026-08-22 12:00:00.000000', '2026-08-22 09:00:00.000000', 'OPEN', 100, 31, 5),
(34, 3000, '2026-12-07 18:00:00.000000', '2026-12-05 09:00:00.000000', 'OPEN', 3000, 32, 5),
(35, 600, '2026-08-15 22:00:00.000000', '2026-08-15 20:00:00.000000', 'OPEN', 600, 33, 7),
(36, 1000, '2026-12-18 22:30:00.000000', '2026-12-18 20:00:00.000000', 'OPEN', 1000, 34, 4),
(37, 8000, '2026-07-30 23:00:00.000000', '2026-07-30 19:30:00.000000', 'OPEN', 8000, 35, 9),
(38, 1200, '2026-10-30 22:30:00.000000', '2026-10-30 19:30:00.000000', 'OPEN', 1200, 36, 3),
(39, 5000, '2026-08-25 11:30:00.000000', '2026-08-25 07:00:00.000000', 'OPEN', 5000, 37, 9),
(40, 400, '2026-09-05 12:00:00.000000', '2026-09-05 08:30:00.000000', 'OPEN', 400, 38, 7),
-- 20 Suất diễn mới bổ sung (IDs 41 - 60)
(41, 3000, '2026-10-20 23:00:00.000000', '2026-10-20 19:00:00.000000', 'OPEN', 3000, 39, 10),
(42, 1000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 1000, 40, 10),
(43, 5000, '2026-09-15 17:00:00.000000', '2026-09-15 08:00:00.000000', 'OPEN', 5000, 41, 11),
(44, 15000, '2026-06-10 23:00:00.000000', '2026-06-10 19:30:00.000000', 'OPEN', 15000, 42, 11),
(45, 12000, '2026-11-28 23:30:00.000000', '2026-11-28 19:30:00.000000', 'OPEN', 12000, 43, 1),
(46, 2000, '2026-09-18 22:30:00.000000', '2026-09-18 19:30:00.000000', 'OPEN', 2000, 44, 2),
(47, 1500, '2026-09-30 22:30:00.000000', '2026-09-30 20:00:00.000000', 'OPEN', 1500, 45, 3),
(48, 1800, '2026-12-15 22:30:00.000000', '2026-12-15 19:30:00.000000', 'OPEN', 1800, 46, 3),
(49, 600, '2026-07-20 17:00:00.000000', '2026-07-20 08:30:00.000000', 'OPEN', 600, 47, 5),
(50, 10000, '2026-10-25 18:00:00.000000', '2026-10-20 09:00:00.000000', 'OPEN', 10000, 48, 5),
(51, 8000, '2026-11-15 22:00:00.000000', '2026-11-12 09:00:00.000000', 'OPEN', 8000, 49, 1),
(52, 2500, '2026-09-05 22:00:00.000000', '2026-09-05 19:00:00.000000', 'OPEN', 2500, 50, 6),
(53, 1500, '2026-10-25 22:30:00.000000', '2026-10-25 19:30:00.000000', 'OPEN', 1500, 51, 8),
(54, 20000, '2026-12-25 23:00:00.000000', '2026-12-20 08:00:00.000000', 'OPEN', 20000, 52, 8),
(55, 1200, '2026-08-30 18:00:00.000000', '2026-08-25 09:00:00.000000', 'OPEN', 1200, 53, 7),
(56, 6000, '2026-07-28 23:30:00.000000', '2026-07-28 19:00:00.000000', 'OPEN', 6000, 54, 9),
(57, 1200, '2026-09-12 22:30:00.000000', '2026-09-12 19:30:00.000000', 'OPEN', 1200, 55, 2),
(58, 10000, '2026-08-30 11:30:00.000000', '2026-08-30 07:00:00.000000', 'OPEN', 10000, 56, 7),
(59, 150, '2026-09-06 12:00:00.000000', '2026-09-06 09:00:00.000000', 'OPEN', 150, 57, 2),
(60, 2000, '2026-11-20 22:30:00.000000', '2026-11-20 19:30:00.000000', 'OPEN', 2000, 58, 5);
/*!40000 ALTER TABLE `event_performances` ENABLE KEYS */;
UNLOCK TABLES;

-- 3. Bổ sung các Loại vé cho từng suất diễn (Ticket Types)
LOCK TABLES `ticket_types` WRITE;
/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
INSERT IGNORE INTO `ticket_types` (`id`, `max_tickets_per_user`, `name`, `performance_id`, `price`, `reserved_quantity`, `sale_end`, `sale_start`, `sold_quantity`, `total_quantity`, `version`) VALUES
(18, 4, 'Vé Ban Công', 11, 500000.00, 0, '2026-07-24 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 1500, 0),
(19, 2, 'Vé VIP', 11, 1500000.00, 0, '2026-07-24 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 1500, 0),
(20, 4, 'Vé Khán Đài', 12, 800000.00, 0, '2026-09-01 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 20000, 0),
(21, 2, 'Vé VVIP Sân Cỏ', 12, 3000000.00, 0, '2026-09-01 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 5000, 0),
(22, 1, 'Vé Tiêu Chuẩn', 13, 1000000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 400, 0),
(23, 1, 'Vé VIP (Có TeaBreak)', 13, 2000000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 100, 0),
(24, 4, 'Vé Người Lớn', 14, 500000.00, 0, '2026-07-19 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 700, 0),
(25, 4, 'Vé Trẻ Em', 14, 200000.00, 0, '2026-07-19 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 300, 0),
(26, 4, 'Vé Tiêu Chuẩn', 15, 300000.00, 0, '2026-11-04 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 2500, 0),
(27, 2, 'Vé Courtside', 15, 1500000.00, 0, '2026-11-04 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 500, 0),
(28, 5, 'Vé Vào Cổng', 16, 250000.00, 0, '2026-12-30 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 4000, 0),
(29, 2, 'Vé Trải Nghiệm VR', 16, 350000.00, 0, '2026-12-30 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 1000, 0),
(30, 4, 'Vé Thường', 17, 50000.00, 0, '2026-10-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 9000, 0),
(31, 4, 'Vé Premium (Combo)', 17, 150000.00, 0, '2026-10-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1000, 0),
(32, 2, 'Hạng Bạc', 18, 1200000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 2500, 0),
(33, 2, 'Hạng Vàng', 18, 4000000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 1500, 0),
(34, 2, 'Vé Tiêu Chuẩn', 19, 200000.00, 0, '2026-09-09 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 600, 0),
(35, 1, 'Vé VIP', 19, 500000.00, 0, '2026-09-09 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 200, 0),
(36, 4, 'Vé Lầu', 20, 250000.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1000, 0),
(37, 2, 'Vé Trệt', 20, 450000.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(38, 4, 'Vé Tiêu Chuẩn', 21, 400000.00, 0, '2026-10-09 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1500, 0),
(39, 2, 'Vé VIP Ngắm Cảnh', 21, 1500000.00, 0, '2026-10-09 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(40, 5, 'Vé GA Vào Cổng', 22, 100000.00, 0, '2026-08-07 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 4000, 0),
(41, 2, 'Vé VIP Khán Đài', 22, 300000.00, 0, '2026-08-07 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 1000, 0),
(42, 4, 'Hạng Phổ Thông', 23, 200000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(43, 2, 'Hạng Thượng Khách', 23, 800000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(44, 4, 'Vé Ban Công', 24, 500000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 1000, 0),
(45, 2, 'Vé VIP Sát Sân Khấu', 24, 2500000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 200, 0),
(46, 2, 'Cự Ly Phổ Thông 5K-10K', 25, 300000.00, 0, '2026-09-11 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 2000, 0),
(47, 2, 'Cự Ly Chuyên Nghiệp 21K-42K', 25, 800000.00, 0, '2026-09-11 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1000, 0),
(48, 1, 'Vé Phổ Thông', 26, 500000.00, 0, '2026-07-17 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 400, 0),
(49, 1, 'Vé VIP (Tài Liệu Độc Quyền)', 26, 1500000.00, 0, '2026-07-17 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 100, 0),
(50, 4, 'Vé Thường', 27, 100000.00, 0, '2026-07-31 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 600, 0),
(51, 2, 'Vé VIP (Kèm Quà Tặng)', 27, 250000.00, 0, '2026-07-31 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 200, 0),
(52, 2, 'Hạng Phổ Thông', 28, 800000.00, 0, '2026-09-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1000, 0),
(53, 2, 'Hạng VIP', 28, 3000000.00, 0, '2026-09-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 500, 0),
(54, 4, 'Vé Thường', 29, 250000.00, 0, '2026-10-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 3000, 0),
(55, 2, 'Vé VIP (Tặng 1 Ly Bia)', 29, 600000.00, 0, '2026-10-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1000, 0),
(56, 4, 'Vé Khán Đài Thường', 30, 1200000.00, 0, '2026-11-14 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 12000, 0),
(57, 2, 'Vé VVIP Sân Cỏ', 30, 5000000.00, 0, '2026-11-14 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 3000, 0),
(58, 4, 'Vé Tiêu Chuẩn', 31, 150000.00, 0, '2026-07-27 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 600, 0),
(59, 2, 'Vé VIP Ghế Đầu', 31, 500000.00, 0, '2026-07-27 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(60, 4, 'Vé Khán Đài Thường', 32, 200000.00, 0, '2026-10-23 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1500, 0),
(61, 2, 'Vé VIP Sát Sân Đấu', 32, 1000000.00, 0, '2026-10-23 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 500, 0),
(62, 2, 'Vé Tiêu Chuẩn', 33, 350000.00, 0, '2026-08-21 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 70, 0),
(63, 1, 'Vé VIP (Trà Đạo Đặc Biệt)', 33, 600000.00, 0, '2026-08-21 23:59:59.000000', '2026-06-15 09:00:00.000000', 0, 30, 0),
(64, 4, 'Vé Vào Cổng Triển Lãm', 34, 150000.00, 0, '2026-12-04 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 2500, 0),
(65, 2, 'Vé Trải Nghiệm Robot VIP', 34, 400000.00, 0, '2026-12-04 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 500, 0),
(66, 4, 'Vé Thường', 35, 150000.00, 0, '2026-08-14 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(67, 2, 'Vé VIP Ghế Đầu', 35, 350000.00, 0, '2026-08-14 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 100, 0),
(68, 4, 'Vé Khán Đài B', 36, 500000.00, 0, '2026-12-17 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 800, 0),
(69, 2, 'Vé Khán Đài A (VIP)', 36, 2000000.00, 0, '2026-12-17 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 200, 0),
(70, 4, 'Vé Thường GA', 37, 100000.00, 0, '2026-07-29 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 6000, 0),
(71, 2, 'Vé VIP Khán Đài', 37, 400000.00, 0, '2026-07-29 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 2000, 0),
(72, 4, 'Vé Tiêu Chuẩn', 38, 200000.00, 0, '2026-10-29 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1000, 0),
(73, 2, 'Vé VIP Hàng Ghế Đầu', 38, 1000000.00, 0, '2026-10-29 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 200, 0),
(74, 4, 'Vé GA Đường Đua', 39, 50000.00, 0, '2026-08-24 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 4500, 0),
(75, 2, 'Vé VIP Lều Quan Sát', 39, 150000.00, 0, '2026-08-24 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(76, 2, 'Vé Tham Dự Thường', 40, 300000.00, 0, '2026-09-04 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 300, 0),
(77, 1, 'Vé VIP Ghế Đầu Trực Tiếp', 40, 800000.00, 0, '2026-09-04 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 100, 0),
-- 40 Loại vé mới bổ sung (IDs 78 - 117)
(78, 4, 'Vé Đứng GA Thường', 41, 200000.00, 0, '2026-10-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 2500, 0),
(79, 2, 'Vé VIP Sân Đấu', 41, 800000.00, 0, '2026-10-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 500, 0),
(80, 4, 'Vé Khán Đài Thường', 42, 150000.00, 0, '2026-11-14 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 800, 0),
(81, 2, 'Vé VIP Ghế Đầu', 42, 500000.00, 0, '2026-11-14 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 200, 0),
(82, 4, 'Vé Phổ Thông Vé Đứng', 43, 50000.00, 0, '2026-09-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 4500, 0),
(83, 2, 'Vé VIP Khán Đài A', 43, 200000.00, 0, '2026-09-14 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 500, 0),
(84, 5, 'Vé Vào Cổng Tự Do', 44, 0.00, 0, '2026-06-09 23:59:59.000000', '2026-05-01 09:00:00.000000', 0, 12000, 0),
(85, 2, 'Vé VIP VIP Zone', 44, 150000.00, 0, '2026-06-09 23:59:59.000000', '2026-05-01 09:00:00.000000', 0, 3000, 0),
(86, 2, 'Vé Thường GA', 45, 800000.00, 0, '2026-11-27 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 10000, 0),
(87, 2, 'Vé VIP Sân Cỏ', 45, 4000000.00, 0, '2026-11-27 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 2000, 0),
(88, 4, 'Vé Tiêu Chuẩn', 46, 500000.00, 0, '2026-09-17 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1500, 0),
(89, 2, 'Vé VIP Khán Đài', 46, 2500000.00, 0, '2026-09-17 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(90, 4, 'Vé Thường', 47, 300000.00, 0, '2026-09-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1200, 0),
(91, 2, 'Vé VIP Hàng Ghế Đầu', 47, 1000000.00, 0, '2026-09-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 300, 0),
(92, 4, 'Vé Ban Công Hạng B', 48, 800000.00, 0, '2026-12-14 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 1500, 0),
(93, 2, 'Vé VIP Hạng Gold', 48, 3500000.00, 0, '2026-12-14 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 300, 0),
(94, 2, 'Vé Thường Hạng B', 49, 400000.00, 0, '2026-07-19 23:59:59.000000', '2026-05-15 09:00:00.000000', 0, 500, 0),
(95, 1, 'Vé VIP (Kèm Quà Tặng AI)', 49, 1200000.00, 0, '2026-07-19 23:59:59.000000', '2026-05-15 09:00:00.000000', 0, 100, 0),
(96, 4, 'Vé Vào Cổng Triển Lãm', 50, 100000.00, 0, '2026-10-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 8000, 0),
(97, 2, 'Vé VIP Trải Nghiệm Siêu Xe', 50, 300000.00, 0, '2026-10-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 2000, 0),
(98, 4, 'Vé GA Phổ Thông', 51, 50000.00, 0, '2026-11-14 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 7000, 0),
(99, 2, 'Vé VIP ẩm thực đặc biệt', 51, 200000.00, 0, '2026-11-14 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 1000, 0),
(100, 4, 'Vé Thường Khán Đài B', 52, 200000.00, 0, '2026-09-04 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 2000, 0),
(101, 2, 'Vé VIP Courtside', 52, 1200000.00, 0, '2026-09-04 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 500, 0),
(102, 4, 'Vé Thường GA', 53, 300000.00, 0, '2026-10-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 1200, 0),
(103, 2, 'Vé VIP Sát Khán Đài', 53, 1200000.00, 0, '2026-10-24 23:59:59.000000', '2026-08-01 09:00:00.000000', 0, 300, 0),
(104, 5, 'Vé Vào Cổng Tự Do', 54, 0.00, 0, '2026-12-24 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 15000, 0),
(105, 2, 'Vé VIP Khán Đài Danh Dự', 54, 200000.00, 0, '2026-12-24 23:59:59.000000', '2026-10-01 09:00:00.000000', 0, 5000, 0),
(106, 4, 'Vé Thường Triển Lãm', 55, 50000.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 1000, 0),
(107, 2, 'Vé VIP Thưởng Lãm Tranh', 55, 150000.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 200, 0),
(108, 4, 'Vé GA Phổ Thông', 56, 400000.00, 0, '2026-07-27 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 5000, 0),
(109, 2, 'Vé VIP Khu Vực Khô', 56, 1500000.00, 0, '2026-07-27 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 1000, 0),
(110, 4, 'Vé Khán Đài B', 57, 150000.00, 0, '2026-09-11 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 1000, 0),
(111, 2, 'Vé Khán Đài A VIP', 57, 400000.00, 0, '2026-09-11 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 200, 0),
(112, 5, 'Vé GA Vào Cổng Tự Do', 58, 0.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 8000, 0),
(113, 2, 'Vé VIP Khán Đài Danh Dự', 58, 100000.00, 0, '2026-08-29 23:59:59.000000', '2026-07-01 09:00:00.000000', 0, 2000, 0),
(114, 2, 'Vé Tiêu Chuẩn Hạng B', 59, 250000.00, 0, '2026-09-05 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 100, 0),
(115, 1, 'Vé VIP Tự Tay Làm Gốm', 59, 500000.00, 0, '2026-09-05 23:59:59.000000', '2026-07-15 09:00:00.000000', 0, 50, 0),
(116, 4, 'Vé Tiêu Chuẩn Silver', 60, 500000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 1500, 0),
(117, 2, 'Vé VIP Hàng Ghế Đầu FrontRow', 60, 2000000.00, 0, '2026-11-19 23:59:59.000000', '2026-09-01 09:00:00.000000', 0, 500, 0);
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;
UNLOCK TABLES;


-- ==============================================================================

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



-- ==============================================================================
-- THỨ TỰ CHẠY SCRIPT: BƯỚC 5 (Bổ sung thêm 22 sự kiện để đạt tổng cộng 100 sự kiện)
-- ==============================================================================
USE `ticketbox`;

SET FOREIGN_KEY_CHECKS = 0;

-- Bổ sung 22 Sự kiện mới (Events) (IDs 79 - 100)
LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT IGNORE INTO `events` (`id`, `available_tickets`, `category`, `category_id`, `city`, `created_at`, `description`, `end_time`, `image_url`, `is_featured`, `location`, `max_price`, `min_price`, `organizer_id`, `organizer_info`, `organizer_logo`, `organizer_name`, `poster_url`, `settings_config`, `start_time`, `status`, `thumbnail_url`, `title`, `total_tickets`, `updated_at`, `view_count`, `venue_id`) VALUES
(79, 1000, 'OTHER', 8, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Sự kiện đặc biệt kết nối cộng đồng, chia sẻ cơ hội hợp tác kinh doanh và trao đổi tri thức bổ ích cho học tập cũng như công việc.', '2026-08-15 22:30:00.000000', 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1200&auto=format&fit=crop', b'0', '240-242 Đường 3/2, Phường 12, Quận 10', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=400&auto=format&fit=crop', 'Hội Chợ Sách Cũ Và Cổ Hà Nội', 1000, '2026-05-25 12:00:00.000000', 8610, 3),
(80, 1000, 'MUSIC', 1, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Đêm nhạc đặc sắc hội tụ các giọng ca nổi tiếng mang đến cho khán giả không gian âm nhạc tuyệt vời lắng đọng và giàu cảm xúc.', '2026-09-15 22:30:00.000000', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', b'1', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop', 'Đêm Nhạc Giao Hưởng Mùa Đông', 1000, '2026-05-25 12:00:00.000000', 8700, 4),
(81, 1000, 'EXHIBITION', 2, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Triển lãm quy tụ hàng trăm tác phẩm nghệ thuật độc đáo từ các nghệ sĩ danh tiếng phản ánh sống động thực tiễn cuộc sống.', '2026-10-15 22:30:00.000000', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Nghệ Thuật Kỹ Thuật Số', 1000, '2026-05-25 12:00:00.000000', 8790, 5),
(82, 1000, 'FESTIVAL', 3, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Lễ hội văn hóa truyền thống kết hợp hiện đại với nhiều hoạt động giải trí sôi nổi, ẩm thực phong phú và các tiết mục đặc sắc.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop', b'0', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Ẩm Thực Đường Phố Sài Gòn', 1000, '2026-05-25 12:00:00.000000', 8880, 6),
(83, 1000, 'WORKSHOP', 4, 'Đà Nẵng', '2026-05-25 12:00:00.000000', 'Buổi chia sẻ kiến thức thực chiến và hướng dẫn thực hành chi tiết từ các chuyên gia đầu ngành có nhiều năm kinh nghiệm.', '2026-12-15 22:30:00.000000', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop', 'Workshop: Khởi Nghiệp Kỷ Nguyên Số', 1000, '2026-05-25 12:00:00.000000', 8970, 7),
(84, 1000, 'THEATER', 5, 'Đà Lạt', '2026-05-25 12:00:00.000000', 'Vở diễn nghệ thuật đỉnh cao được dàn dựng công phu từ nội dung kịch bản cho đến diễn xuất nội lực sâu sắc của các diễn viên.', '2026-07-15 22:30:00.000000', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop', b'0', 'Phường 1, Thành phố Đà Lạt', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=400&auto=format&fit=crop', 'Nhạc Kịch: Phantom of the Opera (Phiên bản Việt)', 1000, '2026-05-25 12:00:00.000000', 9060, 8),
(85, 1000, 'SPORTS', 6, 'Nha Trang', '2026-05-25 12:00:00.000000', 'Giải đấu thể thao kịch tính, hấp dẫn quy tụ các vận động viên tài năng tranh tài giành cúp vô địch và các giải thưởng giá trị.', '2026-08-15 22:30:00.000000', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop', b'1', 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop', 'Giải Vô Địch Bóng Rổ Học Sinh/Sinh Viên', 1000, '2026-05-25 12:00:00.000000', 9150, 9),
(86, 1000, 'COMEDY', 7, 'Cần Thơ', '2026-05-25 12:00:00.000000', 'Chương trình hài kịch đặc sắc mang đến tiếng cười vui nhộn, sảng khoái xua tan những mệt mỏi lo toan thường nhật.', '2026-09-15 22:30:00.000000', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop', b'0', 'Lưu Hữu Phước, Ninh Kiều', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop', 'Stand-up Comedy: Tiếng Cười Sinh Viên', 1000, '2026-05-25 12:00:00.000000', 9240, 10),
(87, 1000, 'OTHER', 8, 'Hải Phòng', '2026-05-25 12:00:00.000000', 'Sự kiện đặc biệt kết nối cộng đồng, chia sẻ cơ hội hợp tác kinh doanh và trao đổi tri thức bổ ích cho học tập cũng như công việc.', '2026-10-15 22:30:00.000000', 'https://images.unsplash.com/photo-1550136555-5f59c2efab22?q=80&w=1200&auto=format&fit=crop', b'0', '17 Lạch Tray, Ngô Quyền', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1550136555-5f59c2efab22?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1550136555-5f59c2efab22?q=80&w=400&auto=format&fit=crop', 'Tuần Lễ Thời Trang Việt Nam Fashion Week', 1000, '2026-05-25 12:00:00.000000', 9330, 11),
(88, 1000, 'MUSIC', 1, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Đêm nhạc đặc sắc hội tụ các giọng ca nổi tiếng mang đến cho khán giả không gian âm nhạc tuyệt vời lắng đọng và giàu cảm xúc.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop', b'0', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop', 'Jazz Club: Smooth Session', 1000, '2026-05-25 12:00:00.000000', 9420, 1),
(89, 1000, 'EXHIBITION', 2, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Triển lãm quy tụ hàng trăm tác phẩm nghệ thuật độc đáo từ các nghệ sĩ danh tiếng phản ánh sống động thực tiễn cuộc sống.', '2026-12-15 22:30:00.000000', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1200&auto=format&fit=crop', b'0', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=400&auto=format&fit=crop', 'Triển Lãm Tranh Sơn Dầu Đương Đại', 1000, '2026-05-25 12:00:00.000000', 9510, 2),
(90, 1000, 'FESTIVAL', 3, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Lễ hội văn hóa truyền thống kết hợp hiện đại với nhiều hoạt động giải trí sôi nổi, ẩm thực phong phú và các tiết mục đặc sắc.', '2026-07-15 22:30:00.000000', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop', b'1', '240-242 Đường 3/2, Phường 12, Quận 10', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Ánh Sáng Kỳ Ảo', 1000, '2026-05-25 12:00:00.000000', 9600, 3),
(91, 1000, 'WORKSHOP', 4, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Buổi chia sẻ kiến thức thực chiến và hướng dẫn thực hành chi tiết từ các chuyên gia đầu ngành có nhiều năm kinh nghiệm.', '2026-08-15 22:30:00.000000', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=400&auto=format&fit=crop', 'Workshop: Trà Đạo Nhật Bản', 1000, '2026-05-25 12:00:00.000000', 9690, 4),
(92, 1000, 'THEATER', 5, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Vở diễn nghệ thuật đỉnh cao được dàn dựng công phu từ nội dung kịch bản cho đến diễn xuất nội lực sâu sắc của các diễn viên.', '2026-09-15 22:30:00.000000', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', b'0', '8 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop', 'Cải Lương: Đời Cô Lựu (Tái diễn 2026)', 1000, '2026-05-25 12:00:00.000000', 9780, 5),
(93, 1000, 'SPORTS', 6, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Giải đấu thể thao kịch tính, hấp dẫn quy tụ các vận động viên tài năng tranh tài giành cúp vô địch và các giải thưởng giá trị.', '2026-10-15 22:30:00.000000', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1200&auto=format&fit=crop', b'0', '12 Trịnh Hoài Đức, Cát Linh, Đống Đa', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=400&auto=format&fit=crop', 'Giải Chạy Marathon Vì Sức Khỏe Cộng Đồng', 1000, '2026-05-25 12:00:00.000000', 9870, 6),
(94, 1000, 'COMEDY', 7, 'Đà Nẵng', '2026-05-25 12:00:00.000000', 'Chương trình hài kịch đặc sắc mang đến tiếng cười vui nhộn, sảng khoái xua tan những mệt mỏi lo toan thường nhật.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=1200&auto=format&fit=crop', b'0', 'Đường Trần Hưng Đạo, Quận Sơn Trà', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1527224857830-43a7ae858368?q=80&w=400&auto=format&fit=crop', 'Hài Kịch: Gặp Nhau Cuối Năm 2026', 1000, '2026-05-25 12:00:00.000000', 9960, 7),
(95, 1000, 'OTHER', 8, 'Đà Lạt', '2026-05-25 12:00:00.000000', 'Sự kiện đặc biệt kết nối cộng đồng, chia sẻ cơ hội hợp tác kinh doanh và trao đổi tri thức bổ ích cho học tập cũng như công việc.', '2026-12-15 22:30:00.000000', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop', b'1', 'Phường 1, Thành phố Đà Lạt', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-12-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop', 'Hội Thảo Giao Lưu Doanh Nghiệp Trẻ', 1000, '2026-05-25 12:00:00.000000', 10050, 8),
(96, 1000, 'MUSIC', 1, 'Nha Trang', '2026-05-25 12:00:00.000000', 'Đêm nhạc đặc sắc hội tụ các giọng ca nổi tiếng mang đến cho khán giả không gian âm nhạc tuyệt vời lắng đọng và giàu cảm xúc.', '2026-07-15 22:30:00.000000', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop', b'0', 'Đại Lộ Nguyễn Tất Thành, Nha Trang', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-07-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop', 'Live Concert: Giai Điệu Tình Yêu', 1000, '2026-05-25 12:00:00.000000', 10140, 9),
(97, 1000, 'EXHIBITION', 2, 'Cần Thơ', '2026-05-25 12:00:00.000000', 'Triển lãm quy tụ hàng trăm tác phẩm nghệ thuật độc đáo từ các nghệ sĩ danh tiếng phản ánh sống động thực tiễn cuộc sống.', '2026-08-15 22:30:00.000000', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop', b'0', 'Lưu Hữu Phước, Ninh Kiều', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-08-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop', 'Trưng Bày Ảnh Đẹp Đất Nước Con Người', 1000, '2026-05-25 12:00:00.000000', 10230, 10),
(98, 1000, 'FESTIVAL', 3, 'Hải Phòng', '2026-05-25 12:00:00.000000', 'Lễ hội văn hóa truyền thống kết hợp hiện đại với nhiều hoạt động giải trí sôi nổi, ẩm thực phong phú và các tiết mục đặc sắc.', '2026-09-15 22:30:00.000000', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', b'0', '17 Lạch Tray, Ngô Quyền', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-09-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop', 'Lễ Hội Khinh Khí Cầu Biển Nha Trang', 1000, '2026-05-25 12:00:00.000000', 10320, 11),
(99, 1000, 'WORKSHOP', 4, 'Hồ Chí Minh', '2026-05-25 12:00:00.000000', 'Buổi chia sẻ kiến thức thực chiến và hướng dẫn thực hành chi tiết từ các chuyên gia đầu ngành có nhiều năm kinh nghiệm.', '2026-10-15 22:30:00.000000', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=1200&auto=format&fit=crop', b'0', '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-10-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=400&auto=format&fit=crop', 'Workshop: Tự Tay Làm Nến Thơm Nghệ Thuật', 1000, '2026-05-25 12:00:00.000000', 10410, 1),
(100, 1000, 'THEATER', 5, 'Hà Nội', '2026-05-25 12:00:00.000000', 'Vở diễn nghệ thuật đỉnh cao được dàn dựng công phu từ nội dung kịch bản cho đến diễn xuất nội lực sâu sắc của các diễn viên.', '2026-11-15 22:30:00.000000', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop', b'1', 'Cổng số 1, Đại lộ Thăng Long, Mễ Trì', 800000, 150000, 1, 'Đối tác tin cậy tổ chức sự kiện chuyên nghiệp.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'TicketBox Partner', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop', '{"privacy":"public"}', '2026-11-15 19:30:00.000000', 'PUBLISHED', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=400&auto=format&fit=crop', 'Kịch Nói: Đêm Lạnh Chùa Hoang', 1000, '2026-05-25 12:00:00.000000', 10500, 2);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

-- Bổ sung 22 Suất diễn cho các Sự kiện trên (Performances) (IDs 79 - 100)
LOCK TABLES `event_performances` WRITE;
/*!40000 ALTER TABLE `event_performances` DISABLE KEYS */;
INSERT IGNORE INTO `event_performances` (`id`, `available_capacity`, `end_time`, `start_time`, `status`, `total_capacity`, `event_id`, `venue_id`) VALUES
(79, 1000, '2026-08-15 22:30:00.000000', '2026-08-15 19:30:00.000000', 'OPEN', 1000, 79, 3),
(80, 1000, '2026-09-15 22:30:00.000000', '2026-09-15 19:30:00.000000', 'OPEN', 1000, 80, 4),
(81, 1000, '2026-10-15 22:30:00.000000', '2026-10-15 19:30:00.000000', 'OPEN', 1000, 81, 5),
(82, 1000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 1000, 82, 6),
(83, 1000, '2026-12-15 22:30:00.000000', '2026-12-15 19:30:00.000000', 'OPEN', 1000, 83, 7),
(84, 1000, '2026-07-15 22:30:00.000000', '2026-07-15 19:30:00.000000', 'OPEN', 1000, 84, 8),
(85, 1000, '2026-08-15 22:30:00.000000', '2026-08-15 19:30:00.000000', 'OPEN', 1000, 85, 9),
(86, 1000, '2026-09-15 22:30:00.000000', '2026-09-15 19:30:00.000000', 'OPEN', 1000, 86, 10),
(87, 1000, '2026-10-15 22:30:00.000000', '2026-10-15 19:30:00.000000', 'OPEN', 1000, 87, 11),
(88, 1000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 1000, 88, 1),
(89, 1000, '2026-12-15 22:30:00.000000', '2026-12-15 19:30:00.000000', 'OPEN', 1000, 89, 2),
(90, 1000, '2026-07-15 22:30:00.000000', '2026-07-15 19:30:00.000000', 'OPEN', 1000, 90, 3),
(91, 1000, '2026-08-15 22:30:00.000000', '2026-08-15 19:30:00.000000', 'OPEN', 1000, 91, 4),
(92, 1000, '2026-09-15 22:30:00.000000', '2026-09-15 19:30:00.000000', 'OPEN', 1000, 92, 5),
(93, 1000, '2026-10-15 22:30:00.000000', '2026-10-15 19:30:00.000000', 'OPEN', 1000, 93, 6),
(94, 1000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 1000, 94, 7),
(95, 1000, '2026-12-15 22:30:00.000000', '2026-12-15 19:30:00.000000', 'OPEN', 1000, 95, 8),
(96, 1000, '2026-07-15 22:30:00.000000', '2026-07-15 19:30:00.000000', 'OPEN', 1000, 96, 9),
(97, 1000, '2026-08-15 22:30:00.000000', '2026-08-15 19:30:00.000000', 'OPEN', 1000, 97, 10),
(98, 1000, '2026-09-15 22:30:00.000000', '2026-09-15 19:30:00.000000', 'OPEN', 1000, 98, 11),
(99, 1000, '2026-10-15 22:30:00.000000', '2026-10-15 19:30:00.000000', 'OPEN', 1000, 99, 1),
(100, 1000, '2026-11-15 22:30:00.000000', '2026-11-15 19:30:00.000000', 'OPEN', 1000, 100, 2);
/*!40000 ALTER TABLE `event_performances` ENABLE KEYS */;
UNLOCK TABLES;

-- Bổ sung các Loại vé cho từng suất diễn (Ticket Types)
LOCK TABLES `ticket_types` WRITE;
/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
INSERT IGNORE INTO `ticket_types` (`id`, `max_tickets_per_user`, `name`, `performance_id`, `price`, `reserved_quantity`, `sale_end`, `sale_start`, `sold_quantity`, `total_quantity`, `version`) VALUES
(500, 4, 'Vé Thường (GA)', 79, 150000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(501, 2, 'Vé VIP Khán Đài', 79, 800000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(502, 4, 'Vé Thường (GA)', 80, 150000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(503, 2, 'Vé VIP Khán Đài', 80, 800000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(504, 4, 'Vé Thường (GA)', 81, 150000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(505, 2, 'Vé VIP Khán Đài', 81, 800000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(506, 4, 'Vé Thường (GA)', 82, 150000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(507, 2, 'Vé VIP Khán Đài', 82, 800000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(508, 4, 'Vé Thường (GA)', 83, 150000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(509, 2, 'Vé VIP Khán Đài', 83, 800000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(510, 4, 'Vé Thường (GA)', 84, 150000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(511, 2, 'Vé VIP Khán Đài', 84, 800000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(512, 4, 'Vé Thường (GA)', 85, 150000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(513, 2, 'Vé VIP Khán Đài', 85, 800000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(514, 4, 'Vé Thường (GA)', 86, 150000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(515, 2, 'Vé VIP Khán Đài', 86, 800000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(516, 4, 'Vé Thường (GA)', 87, 150000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(517, 2, 'Vé VIP Khán Đài', 87, 800000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(518, 4, 'Vé Thường (GA)', 88, 150000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(519, 2, 'Vé VIP Khán Đài', 88, 800000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(520, 4, 'Vé Thường (GA)', 89, 150000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(521, 2, 'Vé VIP Khán Đài', 89, 800000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(522, 4, 'Vé Thường (GA)', 90, 150000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(523, 2, 'Vé VIP Khán Đài', 90, 800000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(524, 4, 'Vé Thường (GA)', 91, 150000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(525, 2, 'Vé VIP Khán Đài', 91, 800000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(526, 4, 'Vé Thường (GA)', 92, 150000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(527, 2, 'Vé VIP Khán Đài', 92, 800000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(528, 4, 'Vé Thường (GA)', 93, 150000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(529, 2, 'Vé VIP Khán Đài', 93, 800000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(530, 4, 'Vé Thường (GA)', 94, 150000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(531, 2, 'Vé VIP Khán Đài', 94, 800000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(532, 4, 'Vé Thường (GA)', 95, 150000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(533, 2, 'Vé VIP Khán Đài', 95, 800000.00, 0, '2026-12-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(534, 4, 'Vé Thường (GA)', 96, 150000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(535, 2, 'Vé VIP Khán Đài', 96, 800000.00, 0, '2026-07-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(536, 4, 'Vé Thường (GA)', 97, 150000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(537, 2, 'Vé VIP Khán Đài', 97, 800000.00, 0, '2026-08-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(538, 4, 'Vé Thường (GA)', 98, 150000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(539, 2, 'Vé VIP Khán Đài', 98, 800000.00, 0, '2026-09-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(540, 4, 'Vé Thường (GA)', 99, 150000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(541, 2, 'Vé VIP Khán Đài', 99, 800000.00, 0, '2026-10-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0),
(542, 4, 'Vé Thường (GA)', 100, 150000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 800, 0),
(543, 2, 'Vé VIP Khán Đài', 100, 800000.00, 0, '2026-11-14 23:59:59.000000', '2026-06-01 09:00:00.000000', 0, 200, 0);
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;
UNLOCK TABLES;

-- Bổ sung Thông tin Thanh toán của Ban tổ chức (Organizer Payment Infos) (event_id 79 - 100)
LOCK TABLES `organizer_payment_infos` WRITE;
/*!40000 ALTER TABLE `organizer_payment_infos` DISABLE KEYS */;
INSERT IGNORE INTO `organizer_payment_infos` (`event_id`, `account_owner`, `account_number`, `bank_name`, `bank_branch`, `tax_code`, `address`) VALUES
(79, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(80, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(81, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(82, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(83, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(84, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(85, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(86, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(87, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(88, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(89, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(90, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(91, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(92, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(93, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(94, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(95, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(96, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(97, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(98, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(99, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt'),
(100, 'TRAN VAN HAU', '338858196', 'MBBank', 'Dĩ An', '0354678', '218 Lý Thường Kiệt');
/*!40000 ALTER TABLE `organizer_payment_infos` ENABLE KEYS */;
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;
