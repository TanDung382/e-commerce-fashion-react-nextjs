# 🛍️ ZZ_2hand – Second-hand Fashion E-commerce Platform

[Tiếng Việt](./README-vn.md)

## 🌟 Introduction

**ZZ_2hand** is an e-commerce platform in Vietnam that specializes in **second-hand** fashion. The project is developed using a **Microservices architecture**, with separate and easily scalable services for both **users** and **admins**.

## 🚀 Tech Stack & Status

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


🔹 Key Technologies:

* **Frontend**: Next.js, React, TypeScript, Tailwind CSS
* **Backend**: Node.js, Express, TypeScript
* **Database**: MySQL
* **Deployment**: Docker & Docker Compose
* **API Gateway**: connects and routes requests between microservices

---

## 🚀 Key Features

### 👤 User

* Sign up / Log in with **Email, Google, Facebook** (JWT).
* Search & filter products by **category, brand, price, size**.
* Manage shopping cart: add, remove, and adjust quantities.
* Payment via **Momo, ZaloPay, Bank Transfer, Cash**.
* Manage **personal profile & shipping addresses**.

### 🛠️ Admin

* **CRUD** for **products, categories, sizes, promotions**.
* Manage orders and customer information.

### 🎨 Interface

* **Homepage**: banners, best-selling products, store information.
* **Product category page** with smart filtering.
* **Product detail page**: images, information, reviews.
* **Shopping cart & checkout**.
* Modern **Admin Dashboard**.

### 🔒 Technical

* Independent and scalable **Microservices** architecture.
* **Responsive** design, **SEO** optimization with Next.js.
* Security with **JWT & password encryption**.

---

## 🛠️ System Requirements

* Node.js **v16+**
* MySQL **v8+**
* Docker & Docker Compose
* npm or yarn

---

## 📂 Project Structure

```text
zz_2hand/
│── frontend/            # Next.js/React frontend
│── services/
│   ├── product-service/ # Manages products & categories
│   ├── user-service/    # Manages user accounts
│   ├── order-service/   # Manages shopping cart & orders
│   └── auth-service/    # Authentication & JWT
│── api-gateway/         # Routes requests between services
│── docker-compose.yml
│── LICENSE
│── README-en.md
│── README-vi.md
```

---

## ⚙️ Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/TanDung382/ZZ_2hand.git
cd zz_2hand
```

### 2️⃣ Install dependencies

In each service directory:

```bash
cd <service-directory>
npm install   # or yarn install
```

### 3️⃣ Configure environment variables

Each service needs an `.env` file.

Example for **Product Service**:

```env
DB_HOST=<your-database-host>
DB_PORT=3306
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_NAME=product_service_db
PORT=5001
```

---

## 🗄️ Database Setup

📥 Download database files here:
👉 [Google Drive](https://drive.google.com/drive/folders/1QdhkQK5Y_nBoGSJcW0ZF8GYThWB-Ubvi?usp=sharing)

* Unzip `db.zip`
* Import the schema files into MySQL

---

## ▶️ Running the Project

### 🚢 With Docker (Recommended)

```bash
docker-compose up -d --build
```

* Frontend: [http://localhost:3000] 
* Admin: [http://localhost:3000/dashboard]
* API Gateway: [http://localhost:4000]

### 💻 Manual run (without Docker)

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

## 🤝 Contribution

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```
4. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```
5. Create a Pull Request 🎉

---

## 📜 License

The project is released under the **MIT License**.
See the [LICENSE](./LICENSE).

---
