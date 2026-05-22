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
  `name` varchar(50) NOT NULL,
  `performance_id` bigint NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `reserved_quantity` int DEFAULT '0',
  `sale_end` datetime(6) NOT NULL,
  `sale_start` datetime(6) NOT NULL,
  `sold_quantity` int DEFAULT '0',
  `total_quantity` int NOT NULL,
  `version` bigint DEFAULT NULL,
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
INSERT INTO `ticket_types` VALUES (1,2,'Vé VIP',1,2000000.00,0,'2026-06-14 23:59:59.000000','2026-05-01 09:00:00.000000',0,2000,NULL),(2,4,'Vé GA',1,800000.00,0,'2026-06-14 23:59:59.000000','2026-05-01 09:00:00.000000',0,8000,NULL),(3,2,'Vé VIP',2,2000000.00,0,'2026-06-15 23:59:59.000000','2026-05-01 09:00:00.000000',0,2000,NULL),(4,4,'Vé GA',2,800000.00,0,'2026-06-15 23:59:59.000000','2026-05-01 09:00:00.000000',0,8000,NULL),(5,1,'Vé Standard',3,0.00,0,'2026-07-09 12:00:00.000000','2026-06-01 08:00:00.000000',0,800,NULL),(6,2,'Vé Business',3,1000000.00,0,'2026-07-09 12:00:00.000000','2026-06-01 08:00:00.000000',0,200,NULL),(7,4,'Vé Thường',4,250000.00,0,'2026-08-19 20:00:00.000000','2026-07-01 10:00:00.000000',0,1800,NULL),(8,2,'Vé VIP',4,500000.00,0,'2026-08-19 20:00:00.000000','2026-07-01 10:00:00.000000',0,200,NULL),(9,4,'Vé Đồng Âm',5,750000.00,0,'2026-10-09 23:59:59.000000','2026-08-01 00:00:00.000000',0,35000,NULL),(10,2,'Vé VIP',5,1500000.00,0,'2026-10-09 23:59:59.000000','2026-08-01 00:00:00.000000',0,5000,NULL),(11,1,'Vé Sinh Viên',6,0.00,0,'2026-09-04 18:00:00.000000','2026-08-01 09:00:00.000000',0,100,NULL),(12,1,'BIB 5KM',7,200000.00,0,'2026-11-15 23:59:59.000000','2026-09-01 00:00:00.000000',0,3000,NULL),(13,1,'BIB 10KM',7,350000.00,0,'2026-11-15 23:59:59.000000','2026-09-01 00:00:00.000000',0,2000,NULL),(14,4,'Ghế Thường',8,300000.00,0,'2026-11-30 18:00:00.000000','2026-11-01 09:00:00.000000',0,1000,NULL),(15,4,'Ghế VIP',8,600000.00,0,'2026-11-30 18:00:00.000000','2026-11-01 09:00:00.000000',0,500,NULL),(16,4,'Ghế Thường',9,300000.00,0,'2026-12-01 18:00:00.000000','2026-11-01 09:00:00.000000',0,1000,NULL),(17,4,'Ghế VIP',9,600000.00,0,'2026-12-01 18:00:00.000000','2026-11-01 09:00:00.000000',0,500,NULL);
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
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 22:11:27
