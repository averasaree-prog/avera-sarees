# AVERA / Saanvi Sarees — Production Deployment Guide

This guide details how to deploy the full-stack luxury saree shopping application to production with **Vercel** (Frontend), **Render / Railway / AWS** (Backend), and **Neon / Supabase / RDS** (Managed PostgreSQL Database).

---

## 1. 🗄️ Database Setup (Neon PostgreSQL)

1. Create a serverless PostgreSQL instance on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Retrieve your connection string, which will look like:
   ```
   postgresql://avera_user:secret_password@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/avera_sarees_db?sslmode=require
   ```
3. Initialize the database schema:
   - The Spring Boot backend executes automatic schema generation/updates on startup.
   - Alternatively, execute `database/schema.sql` directly using `psql` or the Neon SQL Editor console.

---

## 2. ☕ Backend Deployment (Spring Boot 3 on Render / Railway)

### Using Render:
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New Web Service**.
2. Connect your repository and choose the `backend/` root directory.
3. Configure the service settings:
   - **Environment**: Java / Docker
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/saree-store-backend-1.0.0.jar`
4. Set the Environment Variables:
   ```env
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   DB_URL=jdbc:postgresql://ep-cool-butterfly-123456.us-east-2.aws.neon.tech/avera_sarees_db?sslmode=require
   DB_USERNAME=avera_user
   DB_PASSWORD=your_neon_password
   JWT_SECRET=YourSuperLongAndSecure256BitJwtSecretKeyForAvera2026!
   JWT_EXPIRATION_MS=86400000
   RAZORPAY_KEY_ID=rzp_live_your_live_key
   RAZORPAY_KEY_SECRET=your_live_secret
   ALLOWED_ORIGINS=https://avera-sarees.vercel.app,http://localhost:5173
   INITIAL_ADMIN_EMAIL=admin@averasarees.com
   INITIAL_ADMIN_PASSWORD=Admin@Avera2026!
   INITIAL_ADMIN_NAME=AVERA Master Admin
   ```
5. Deploy. Render will assign a public URL such as `https://avera-backend.onrender.com`.
6. Verify health check at `https://avera-backend.onrender.com/v3/api-docs` and `https://avera-backend.onrender.com/swagger-ui.html`.

---

## 3. ⚡ Frontend Deployment (React + Vite on Vercel)

### Using Vercel:
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your Git repository and set the **Root Directory** to `frontend`.
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Configure Environment Variables:
   ```env
   VITE_API_BASE_URL=https://avera-backend.onrender.com
   ```
5. Deploy. Vercel provides an instant global CDN deployment with SSL and custom domain support.

---

## 4. 💳 Razorpay Live Payment Gateway Activation

1. Complete KYC verification on the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate Live API Keys (**Key ID** and **Key Secret**).
3. Set Webhook Endpoint in Razorpay:
   - **URL**: `https://avera-backend.onrender.com/api/payments/webhook`
   - **Secret**: Configure in `RAZORPAY_WEBHOOK_SECRET`
   - **Active Events**: `order.paid`, `payment.captured`, `payment.failed`
4. Test live card, UPI, and Netbanking transactions.
