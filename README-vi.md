# 🛍️ ZZ_2hand – Fashion E-commerce Platform (Second-hand)

[English](./README-en.md)

## 🌟 Giới thiệu
**ZZ_2hand** là nền tảng thương mại điện tử chuyên về thời trang **second-hand** tại Việt Nam.  
Dự án được phát triển theo **kiến trúc Microservices**, với các dịch vụ tách biệt và dễ mở rộng, phục vụ cả **người dùng** và **admin**.  

## 🚀 Công nghệ & Trạng thái

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

🔹 Công nghệ chính:  
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend**: Node.js, Express, TypeScript  
- **Database**: MySQL  
- **Triển khai**: Docker & Docker Compose  
- **API Gateway**: kết nối và điều phối request giữa các microservices  

---

## 🚀 Tính năng nổi bật

### 👤 Người dùng
- Đăng ký / Đăng nhập bằng **Email, Google, Facebook** (JWT).  
- Tìm kiếm & lọc sản phẩm theo **danh mục, thương hiệu, giá, kích cỡ**.  
- Quản lý giỏ hàng: thêm, xóa, điều chỉnh số lượng.  
- Thanh toán qua **Momo, ZaloPay, Ngân hàng, Tiền mặt**.  
- Quản lý **hồ sơ cá nhân & địa chỉ giao hàng**.  

### 🛠️ Admin
- CRUD **sản phẩm, danh mục, kích cỡ, khuyến mãi**.  
- Quản lý đơn hàng và thông tin khách hàng.  

### 🎨 Giao diện
- **Trang chủ**: banner, sản phẩm bán chạy, thông tin cửa hàng.  
- **Trang danh mục sản phẩm** với bộ lọc thông minh.  
- **Trang chi tiết sản phẩm**: hình ảnh, thông tin, đánh giá.  
- **Giỏ hàng & Thanh toán**.  
- **Admin Dashboard** hiện đại.  

### 🔒 Kỹ thuật
- Kiến trúc **Microservices** độc lập, dễ mở rộng.  
- Giao diện **Responsive**, tối ưu **SEO** với Next.js.  
- Bảo mật với **JWT & mã hóa mật khẩu**.  

---

## 🛠️ Yêu cầu hệ thống
- Node.js **v16+**  
- MySQL **v8+**  
- Docker & Docker Compose  
- npm hoặc yarn  

---

## 📂 Cấu trúc dự án
```
zz_2hand/
│── frontend/            # Next.js/React frontend
│── services/
│   ├── product-service/ # Quản lý sản phẩm & danh mục
│   ├── user-service/    # Quản lý tài khoản người dùng
│   ├── order-service/   # Quản lý giỏ hàng & đơn hàng
│   └── auth-service/    # Xác thực & JWT
│── api-gateway/         # Điều phối request giữa các service
│── docker-compose.yml
│── LICENSE
│── README-en.md
│── README-vi.md
```

---

## ⚙️ Cài đặt

### 1️⃣ Clone repository
```bash
git clone https://github.com/TanDung382/ZZ_2hand.git
cd zz_2hand
```

### 2️⃣ Cài dependencies
Trong từng thư mục service:
```bash
cd <service-directory>
npm install   # hoặc yarn install
```

### 3️⃣ Cấu hình biến môi trường
Mỗi service cần có file `.env`.  

Ví dụ cho **Product Service**:
```env
DB_HOST=<your-database-host>
DB_PORT=3306
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_NAME=product_service_db
PORT=5001
```

---

## 🗄️ Thiết lập Database
📥 Tải file database tại:  
👉 [Google Drive](https://drive.google.com/drive/folders/1QdhkQK5Y_nBoGSJcW0ZF8GYThWB-Ubvi?usp=sharing)  

- Giải nén `db.zip`  
- Import các file schema vào MySQL  

---

## ▶️ Chạy dự án

### 🚢 Với Docker (Khuyến nghị)
```bash
docker-compose up -d --build
```
* Frontend: [http://localhost:3000] 
* Admin: [http://localhost:3000/dashboard]
* API Gateway: [http://localhost:4000]

### 💻 Chạy thủ công (không dùng Docker)
```bash
# Product Service
cd services/product-service && npm run start

# User Service
cd services/user-service && npm run start

# Order Service
cd services/order-service && npm run start

# Auth Service
cd services/auth-service && npm run start

# API Gateway
cd api-gateway && npm run start

# Frontend
cd frontend && npm run dev
```

---

## 🤝 Đóng góp
1. Fork repository.  
2. Tạo branch mới:  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit thay đổi:  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push branch:  
   ```bash
   git push origin feature/your-feature
   ```
5. Tạo Pull Request 🎉  

---

## 📜 Giấy phép
Dự án phát hành theo **MIT License**.  
Xem chi tiết tại file [LICENSE](./LICENSE).  
