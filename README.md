# AVERA — Luxury Indian Handloom Sarees E-Commerce Platform

> **"Handwoven from the Heart of Bharat"**

A complete, production-ready, full-stack Indian ethnic saree shopping platform engineered for modern connoisseurs of traditional weaves (Silk Blend, Banarasi, Kanjivaram, Chanderi, Organza).

---

## 🎨 Design & Visual Identity

Tailored specifically to the visual specifications provided:
- **Buttons / Primary Accents**: `#800020` (Deep Wine / Burgundy / Oxblood)
- **Text & Soft Accents**: `#E8D5BC` (Warm Heritage Sand / Cream)
- **Headings & Structural Borders**: `#302820` (Dark Umber / Espresso Wood)
- **Background**: `#F9F6F0` (Ivory Silk Tone)
- **Typography**: Cormorant Garamond / Playfair Display (Headings) & Plus Jakarta Sans (Body)
- **Assets**: Authentic AVERA circular logo seal, hero lookbook, and curated saree imagery.

---

## 🏛️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design tokens (`avera.button`, `avera.text`, `avera.heading`)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **API Client**: Axios with request/response interceptors and guest session token persistence

### Backend
- **Framework**: Spring Boot 3.3.4, Java 17 / 25
- **Security**: Spring Security 6, Stateless JWT Authentication, BCrypt password hashing
- **Data Persistence**: Spring Data JPA, Hibernate ORM
- **Database**:
  - Development: Zero-friction embedded H2 persistence file `./h2db/saanvi_sarees`
  - Production: Managed PostgreSQL (Neon / Supabase / RDS)
- **Business Logic**:
  - Server-side atomic stock reservations and price validation
  - Real-time coupon application (`FESTIVE15`, `UTSAV10`)
  - Razorpay payment signature verification via HMAC-SHA256
  - Cash on Delivery (COD) flow
  - Indian 6-digit PIN code delivery estimator
  - Protected admin dashboard (`/api/admin/**`) with role-based authorization

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v16+ or v18+) & npm
- Java 17+ & Maven (tested and validated with JDK 25 and Maven 3.9)

### 1. Start the Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
- Backend will start on: **`http://localhost:8080`**
- Interactive Swagger UI: **`http://localhost:8080/swagger-ui.html`**
- H2 Console: **`http://localhost:8080/h2-console`**

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open your browser at: **`http://localhost:5173`**

---

## 🔑 Default Seeded Accounts & Credentials

### Administrator Account
- **Email**: `admin@saanvisarees.com`
- **Password**: `Admin@Saanvi2026!`
- **Role**: `ROLE_ADMIN`, `ROLE_CUSTOMER`
- Access the Admin Dashboard via the profile menu or navigate directly to `/admin`.

### Active Promotional Coupons
- **`FESTIVE15`**: Extra 15% discount on all orders above ₹2,000 (from the festival banner)
- **`UTSAV10`**: 10% festive discount on all orders above ₹2,999
- **`FIRSTSAANVI`**: Flat ₹500 off on first purchase above ₹2,499

---

## 📁 Repository Structure

```
saanvi-sarees/
├── frontend/
│   ├── public/images/             # Brand logos, hero imagery & visual assets
│   ├── src/
│   │   ├── api/client.js          # Axios API configuration
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Footer, ProductCard, SearchModal, CartDrawer
│   │   │   └── home/              # FestivalBanner, HeroSection, SignatureCollection, TrustBar
│   │   ├── context/               # Auth, Cart, and Wishlist contexts
│   │   ├── pages/                 # HomePage, ShopPage, ProductDetail, Cart, Checkout, etc.
│   │   ├── index.css              # Custom brand styles & animations
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/main/java/com/saanvi/sarees/
│   │   ├── config/                # SecurityConfig, JwtProvider, DataInitializer
│   │   ├── controller/            # REST controllers
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── entity/                # JPA entities (Product, Order, User, etc.)
│   │   ├── repository/            # Spring Data JPA repositories
│   │   └── service/               # Core business services
│   ├── src/test/java/             # Unit and integration tests
│   └── pom.xml
│
├── database/
│   └── schema.sql                 # Production PostgreSQL schema script
├── docs/
│   ├── API_DOCUMENTATION.md       # API endpoint specification
│   └── DEPLOYMENT_GUIDE.md        # Deployment instructions for Vercel & Render
├── .env.example
└── README.md
```

---

## 🧪 Automated Testing
Run the backend test suite:
```bash
cd backend
mvn test
```
*Results: 5/5 tests passed (Coupon calculations, Indian PIN code validations, Spring Boot context load).*
