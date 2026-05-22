# LAN TLS Certificates (Development)

Thư mục này chứa chứng chỉ TLS và khóa riêng (private key) cục bộ để kích hoạt HTTPS cho Gateway trong môi trường phát triển mạng nội bộ (LAN).

> [!WARNING]
> Không bao giờ commit các tệp tin khóa riêng tư (`dev.key`) lên Git repository.

---

## 1. Prerequisites (Yêu cầu trước khi thực hiện)

Mỗi máy phát triển (hoặc thiết bị truy cập HTTPS trong mạng LAN) cần cài đặt và tin tưởng Root CA được tạo bởi `mkcert`.

### Trên Windows (PowerShell):
1. Cài đặt `mkcert` thông qua winget (chạy dưới quyền Admin):
   ```powershell
   winget install FiloSottile.mkcert
   ```
2. Khởi động lại terminal để cập nhật đường dẫn biến môi trường.
3. Cài đặt chứng chỉ Root CA cục bộ vào máy tính (chạy dưới quyền Admin một lần duy nhất):
   ```powershell
   mkcert -install
   ```

### Trên macOS (Terminal):
1. Cài đặt `mkcert` thông qua Homebrew:
   ```bash
   brew install mkcert
   ```
2. Cài đặt chứng chỉ Root CA cục bộ vào Keychain:
   ```bash
   mkcert -install
   ```

---

## 2. Certificate Generation (Tạo chứng chỉ)

Thực hiện lệnh này tại **thư mục gốc của dự án (repository root)** để tạo chứng chỉ và khóa cho IP LAN cũng như localhost:

1. Tìm địa chỉ IP LAN hiện tại của máy tính:
   - **Windows**: Chạy `ipconfig` trong PowerShell và tìm dòng `IPv4 Address` (ví dụ: `192.168.1.5`).
   - **macOS / Linux**: Chạy `ifconfig` hoặc `ip a`.
2. Tạo chứng chỉ (thay đổi địa chỉ IP `192.168.x.x` bên dưới bằng IP LAN thực tế của bạn):
   ```powershell
   mkcert -cert-file gateway/certs/dev.crt -key-file gateway/certs/dev.key 192.168.x.x localhost 127.0.0.1 ::1
   ```

---

## 3. Docker Run (Khởi động lại Gateway)

Sau khi tạo xong chứng chỉ, hãy chạy lệnh sau từ thư mục gốc của dự án để khởi động lại container gateway với cấu hình mới:

```powershell
docker compose up -d --force-recreate --build gateway
```

Kiểm tra trạng thái Nginx trong container:
```powershell
docker exec ticketbox-gateway nginx -t
```

---

## 4. Critical Troubleshooting (Khắc phục sự cố)

> [!CAUTION]
> **Lỗi lặp chuyển hướng (Cached Redirect Loop):**
> Trình duyệt có thể lưu bộ nhớ đệm (cache) cho các chuyển hướng 301/302 trước đó, dẫn đến việc bị kẹt trong vòng lặp chuyển hướng từ `https://localhost:8443` sang `3000` (hoặc ngược lại).

### Cách xử lý: Thực hiện "Hard Refresh / Empty Cache and Hard Reload"
1. Mở trang bị lỗi trên trình duyệt (Chrome, Edge, Brave, v.v.).
2. Nhấn phím **F12** (hoặc `Ctrl + Shift + I` / `Cmd + Option + I` trên macOS) để mở **Developer Tools**.
3. Nhấp **chuột phải** vào nút **Tải lại trang (Reload/Refresh)** ở góc trên bên trái trình duyệt.
4. Chọn **"Empty Cache and Hard Reload"** (hoặc **"Clear Cache and Hard Update"**).
5. Ngoài ra, bạn cũng có thể mở tab ẩn danh (Incognito window) để kiểm tra lại chính xác nhất.
