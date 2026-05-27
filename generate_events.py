import random
import datetime

categories = ['MUSIC', 'THEATER', 'SPORTS', 'WORKSHOP', 'FESTIVAL', 'COMEDY', 'EXHIBITION', 'OTHER']
cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng']

events_templates = [
    ("Liveshow Âm Nhạc {name}", "MUSIC", "Đêm nhạc đặc biệt với sự góp mặt của ca sĩ {name}. Thưởng thức những giai điệu lãng mạn và sôi động."),
    ("Vở Kịch: {name}", "THEATER", "Một tác phẩm kịch đầy cảm xúc và nước mắt mang tên {name}, tái hiện chân thực đời sống xã hội."),
    ("Giải Chạy Marathon {name}", "SPORTS", "Thử thách giới hạn bản thân với giải chạy {name} quy mô toàn quốc, rèn luyện sức khỏe, gắn kết cộng đồng."),
    ("Workshop: {name}", "WORKSHOP", "Học hỏi và nâng cao kỹ năng {name} cùng các chuyên gia hàng đầu trong ngành. Số lượng giới hạn."),
    ("Lễ Hội Ẩm Thực {name}", "FESTIVAL", "Khám phá thế giới ẩm thực đa dạng tại lễ hội {name}, quy tụ hàng trăm gian hàng đặc sản 3 miền."),
    ("Stand-up Comedy: {name}", "COMEDY", "Cười nghiêng ngả với đêm hài độc thoại {name}, giải tỏa mọi căng thẳng sau những giờ làm việc mệt mỏi."),
    ("Triển Lãm Nghệ Thuật {name}", "EXHIBITION", "Chiêm ngưỡng những tác phẩm nghệ thuật độc đáo tại triển lãm {name}, nơi giao thoa của văn hóa và hội họa."),
    ("Hội Thảo Công Nghệ {name}", "OTHER", "Cập nhật những xu hướng công nghệ mới nhất về trí tuệ nhân tạo và blockchain tại hội thảo {name}.")
]

names = ["Mùa Thu", "Bức Tường", "Khát Vọng", "Tuổi Trẻ", "Đam Mê", "Sáng Tạo", "Bình Minh", "Hoa Hồng", "Tương Lai", "Hạnh Phúc", "Gia Đình", "Bạn Bè", "Khám Phá", "Tinh Hoa", "Đỉnh Cao"]

sql_statements = []

for i in range(20, 70):
    template = random.choice(events_templates)
    title = template[0].replace("{name}", random.choice(names) + " " + str(random.randint(2026, 2030)))
    category = template[1]
    description = template[2].replace("{name}", title)
    city = random.choice(cities)
    
    start_time = f"2026-{random.randint(6, 12):02d}-{random.randint(1, 28):02d} {random.randint(8, 20):02d}:00:00.000000"
    end_time = f"2026-{random.randint(6, 12):02d}-{random.randint(1, 28):02d} {random.randint(12, 23):02d}:00:00.000000"
    
    json_config = "{\"customUrl\":\"event-url\",\"privacy\":\"public\"}"
    sql = f"INSERT INTO `events` (`id`, `available_tickets`, `category`, `category_id`, `city`, `created_at`, `description`, `end_time`, `image_url`, `is_featured`, `location`, `max_price`, `min_price`, `organizer_id`, `organizer_info`, `organizer_logo`, `organizer_name`, `poster_url`, `settings_config`, `start_time`, `status`, `thumbnail_url`, `title`, `total_tickets`, `updated_at`, `view_count`, `venue_id`) VALUES ({i}, {random.randint(100, 1000)}, '{category}', 1, '{city}', '2026-05-22 10:55:16.000000', '{description}', '{end_time}', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80', 0, 'Trung tâm sự kiện {city}', {random.randint(500000, 2000000)}, {random.randint(0, 500000)}, 1, 'Ban tổ chức sự kiện chuyên nghiệp', 'https://example.com/logo.png', 'Event Corp', 'https://example.com/poster.jpg', '{json_config}', '{start_time}', 'PUBLISHED', 'https://example.com/thumb.jpg', '{title}', {random.randint(1000, 5000)}, '2026-05-22 10:55:16.000000', {random.randint(100, 10000)}, 1);"
    sql = sql.replace("{json_config}", json_config)
    sql_statements.append(sql)

with open("insert_50_events.sql", "w", encoding="utf-8") as f:
    f.write("SET NAMES utf8mb4;\n")
    f.write("SET FOREIGN_KEY_CHECKS=0;\n")
    f.write("\n".join(sql_statements))
    f.write("\n")
