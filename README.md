# 🛍️ ShopEase E-Commerce Platform

A full-stack e-commerce platform built with **React**, **Django REST Framework**, and **PostgreSQL**. The application allows customers to browse products, manage shopping carts and wishlists, place orders, write reviews, and enables administrators to manage products, inventory, and orders.

---

## 🚀 Live Demo

### Frontend
https://e-commerce-frontend-migl.onrender.com/

### Backend API
https://e-commerce-6kpd.onrender.com/

### Admin Panel
https://e-commerce-6kpd.onrender.com/admin/

---

# 📸 Screenshots

> Add screenshots here before submission.

- Home Page
- Product Catalogue 
- Product Details
- Shopping Cart
- Wishlist
- Checkout
- Orders
- Admin Dashboard

---

# ✨ Features

## User Features

- User Registration
- User Login & JWT Authentication
- Product Catalogue
- Category Filtering
- Product Search
- Product Details
- Shopping Cart
- Wishlist
- Product Reviews & Ratings
- Checkout
- Order History
- View Order Details

---

## Admin Features

- Product Management
- Category Management
- Inventory Management
- Product Image Upload
- Order Management
- Update Order Status
- Review Management
- Django Admin Dashboard

---

# 🛠️ Tech Stack

## Frontend

- React
- React Router
- Vite
- CSS
- JavaScript

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication
- Pillow

## Database

- PostgreSQL

## Deployment

- Render
- PostgreSQL Database (Render)

---

# 📂 Project Structure

```
E-commerce/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reviews/
│   │   ├── wishlist/
│   │   └── common/
│   │
│   ├── config/
│   ├── media/
│   ├── staticfiles/
│   ├── requirements.txt
│   └── manage.py
│
├── shopease-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔐 Authentication

Authentication is handled using **JSON Web Tokens (JWT).**

Endpoints:

```
POST /api/v1/register/
POST /api/v1/login/
POST /api/v1/token/refresh/
```

---

# 📦 API Endpoints

## Authentication

```
POST /api/v1/register/
POST /api/v1/login/
POST /api/v1/token/refresh/
```

## Products

```
GET /api/v1/products/
GET /api/v1/products/<id>/
POST /api/v1/products/
PUT /api/v1/products/<id>/
DELETE /api/v1/products/<id>/
```

## Categories

```
GET /api/v1/categories/
```

## Cart

```
GET /api/v1/cart/
POST /api/v1/cart/add/
PATCH /api/v1/cart/update/
DELETE /api/v1/cart/remove/
```

## Wishlist

```
GET /api/v1/wishlist/
POST /api/v1/wishlist/add/
DELETE /api/v1/wishlist/remove/
```

## Orders

```
POST /api/v1/orders/checkout/
GET /api/v1/orders/
GET /api/v1/orders/<id>/
PATCH /api/v1/orders/<id>/status/
```

## Reviews

```
GET /api/v1/reviews/
POST /api/v1/reviews/
PUT /api/v1/reviews/<id>/
DELETE /api/v1/reviews/<id>/
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/WandJproject/E-commerce.git

cd E-commerce
```

---

# Backend Setup

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment.

### Windows

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
source .venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run migrations.

```bash
python manage.py migrate
```

Create a superuser.

```bash
python manage.py createsuperuser
```

Run the server.

```bash
python manage.py runserver
```

---

# Frontend Setup

```bash
cd shopease-frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=your_database_url

ALLOWED_HOSTS=localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=http://localhost:5173

MEDIA_URL=/media/

MEDIA_ROOT=media/
```

---

# Deployment

The application is deployed using **Render**.

Deployment includes:

- React Frontend
- Django REST API
- PostgreSQL Database
- Static Files
- Media Files
- Environment Variables

---

# Future Improvements

- Online Payment Integration
- Email Verification
- Password Reset
- Coupons & Discounts
- Product Recommendations
- Recently Viewed Products
- Admin Analytics Dashboard
- Sales Reports
- Notifications
- Docker Support
- CI/CD Pipeline

---

# 👩‍💻 Author

**Muhammed Jamiu**

Frontend Developer

**Angela Umeobi**

Backend Developer

GitHub: https://github.com/WandJproject

---

# 📄 License

This project was developed for educational purposes as a capstone project.