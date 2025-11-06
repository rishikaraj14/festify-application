# 🎉 Festify - College Event Management Platform

A full-stack event management platform built with **Next.js** frontend and **Spring Boot** backend, designed for college fest registration, ticketing, and team management.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - JWT-based authentication with Supabase
- 🎫 **Event Registration** - Browse and register for college events
- 👥 **Team Management** - Create and manage teams for team-based events
- 💳 **Payment Integration** - Secure payment processing for event tickets
- 🎟️ **Ticket System** - Multiple ticket types (VIP, Early Bird, Regular, Group)
- ⭐ **Event Reviews** - Rate and review events you've attended
- 🏫 **College Management** - Multi-college support
- 🔍 **Advanced Search** - Search events by category, college, date, and more
- 📊 **User Dashboard** - Track your registrations, tickets, and team memberships

### Admin Features
- 📈 **Analytics Dashboard** - Event performance metrics
- 🎪 **Event Management** - Create, update, and manage events
- 💰 **Pricing System** - Flexible pricing with early bird discounts
- 👨‍💼 **Admin Access Control** - Role-based access control (RBAC)

### Technical Features
- 🚀 **High Performance** - Optimized database queries with indexes
- 🔒 **Security** - JWT authentication, secure password hashing
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🎨 **Modern UI** - Built with shadcn/ui components
- ⚡ **Real-time Updates** - Live data synchronization
- 🔄 **RESTful API** - Clean and well-documented API endpoints

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **State Management:** React Context API
- **Authentication:** Supabase Auth
- **HTTP Client:** Custom API Client with JWT support
- **Forms:** React Hook Form + Zod validation

### Backend
- **Framework:** Spring Boot 3.2.12
- **Language:** Java 17
- **Build Tool:** Maven
- **Database:** PostgreSQL (Supabase)
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security + JWT
- **API Documentation:** Spring REST Docs ready

### Database & Infrastructure
- **Database:** PostgreSQL (Supabase hosted)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage (for event images)
- **Email:** SMTP (Gmail integration)

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                  Next.js 15 + TypeScript                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API (HTTPS)
                       │ JWT Token in Headers
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Spring Boot Backend                         │
│           (JWT Authentication Middleware)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security Layer (SupabaseJwtFilter)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST Controllers (11 endpoints)                     │   │
│  │  - Events, Categories, Colleges, Registrations       │   │
│  │  - Teams, Tickets, Payments, Reviews, Profiles       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Service Layer (Business Logic)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Repository Layer (Spring Data JPA)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ JDBC Connection
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              PostgreSQL Database (Supabase)                  │
│  - 10 Tables (events, registrations, teams, etc.)           │
│  - Row Level Security (RLS) policies                        │
│  - Stored procedures & triggers                             │
│  - Performance indexes                                      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **Java** 17 or higher
- **Maven** 3.6+ (or use included Maven wrapper)
- **PostgreSQL** 14+ (or Supabase account)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rishikaraj14/festify-application.git
cd festify-application
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (Maven will download them)
./mvnw clean install

# Or on Windows
.\mvnw.cmd clean install
```

### 3. Frontend Setup

```bash
cd frontend/festify

# Install dependencies
npm install
# or
yarn install
```

## ⚙ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_URL=jdbc:postgresql://your-host:6543/postgres
DB_USER=postgres.your-project-ref
DB_PASS=your-database-password

# JWT Configuration
JWT_SECRET=your-supabase-jwt-secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Configuration
ADMIN_EMAIL=admin@festify.com
ADMIN_PASS=your-admin-password
```

**Getting Configuration Values:**

1. **Database Credentials** (Supabase):
   - Go to your Supabase project
   - Settings → Database → Connection Pooling
   - Copy the connection string (use pooler mode)

2. **JWT Secret**:
   - Supabase Project → Settings → API
   - Copy "JWT Secret"

3. **Gmail SMTP**:
   - Enable 2FA on your Gmail account
   - Generate App Password: Google Account → Security → App Passwords
   - Use the generated password in `SMTP_PASS`

### Frontend Configuration

Create a `.env.local` file in the `frontend/festify/` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Getting Frontend Values:**

- Supabase Project → Settings → API
- Copy "Project URL" and "anon public" key

### Database Setup

Run the database setup script:

```bash
# Connect to your PostgreSQL/Supabase database and run:
psql -h your-host -U postgres -d postgres -f scripts/fix-database-structure.sql

# Or use Supabase SQL Editor and paste the contents of:
# scripts/fix-database-structure.sql
```

This script creates:
- All required tables and enums
- Foreign key constraints
- Performance indexes
- RLS policies
- Stored procedures

## 🏃 Running the Application

### Option 1: Using Scripts (Recommended)

#### Start Backend
```powershell
# Windows PowerShell
cd backend
.\start-backend.ps1
```

```bash
# Linux/Mac
cd backend
# Load environment variables
export $(cat .env | xargs)
# Start the application
java -jar target/festify-backend-0.0.1-SNAPSHOT.jar
```

#### Start Frontend
```bash
cd frontend/festify
npm run dev
# or
yarn dev
```

### Option 2: Development Mode

#### Backend (with auto-reload)
```bash
cd backend
./mvnw spring-boot:run
# Windows: .\mvnw.cmd spring-boot:run
```

#### Frontend (with hot reload)
```bash
cd frontend/festify
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hello` | Health check |
| GET | `/api/colleges` | List all colleges |
| GET | `/api/colleges/{id}` | Get college by ID |
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| GET | `/api/events` | List all events |
| GET | `/api/events/{id}` | Get event details |
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews/event/{eventId}` | Reviews for an event |

### Protected Endpoints (Authentication Required)

#### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create new event (Admin) |
| PUT | `/api/events/{id}` | Update event (Admin) |
| DELETE | `/api/events/{id}` | Delete event (Admin) |

#### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/registrations` | Get user's registrations |
| POST | `/api/registrations` | Register for event |
| DELETE | `/api/registrations/{id}` | Cancel registration |

#### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List user's teams |
| POST | `/api/teams` | Create team |
| PUT | `/api/teams/{id}` | Update team |
| DELETE | `/api/teams/{id}` | Delete team |
| POST | `/api/teams/{id}/members` | Add team member |

#### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get user's tickets |
| GET | `/api/tickets/{id}` | Get ticket details |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create payment |
| GET | `/api/payments/{id}` | Get payment status |

#### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |

#### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/{id}` | Update review |
| DELETE | `/api/reviews/{id}` | Delete review |

### Example Requests

#### Register for an Event
```bash
curl -X POST http://localhost:8080/api/registrations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "participationType": "SOLO",
    "ticketType": "REGULAR"
  }'
```

#### Create a Team
```bash
curl -X POST http://localhost:8080/api/teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Awesome",
    "eventId": 1,
    "maxMembers": 5
  }'
```

## 🗄 Database Schema

### Core Tables

#### events
- Event details, pricing, capacity, dates
- Status: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- Links to colleges and categories

#### registrations
- User event registrations
- Participation type: SOLO, TEAM
- Status tracking: PENDING, CONFIRMED, CANCELLED

#### teams
- Team information for team events
- Member management
- Capacity control

#### tickets
- Generated after successful payment
- QR code for verification
- Ticket types: VIP, EARLY_BIRD, REGULAR, GROUP

#### payments
- Payment tracking
- Razorpay integration ready
- Status: PENDING, COMPLETED, FAILED, REFUNDED

#### profiles
- User profile information
- College affiliation
- Contact details

#### reviews
- Event ratings and feedback
- User verification

### Database Features
- ✅ Row Level Security (RLS)
- ✅ Foreign key constraints with CASCADE
- ✅ Unique constraints
- ✅ Performance indexes on frequently queried columns
- ✅ Stored procedures for complex operations
- ✅ Automatic timestamp management

## 🧪 Testing

### Backend Testing

Run the comprehensive API test script:

```powershell
# Windows
cd backend
.\test.ps1
```

```bash
# Linux/Mac
cd backend
chmod +x test.sh
./test.sh
```

Or test individual endpoints:
```bash
# Health check
curl http://localhost:8080/api/hello

# Get all events
curl http://localhost:8080/api/events

# Get specific event
curl http://localhost:8080/api/events/1
```

### Frontend Testing

```bash
cd frontend/festify

# Run tests (if configured)
npm test

# Build for production (test build)
npm run build
```

## 🚀 Deployment

### Backend Deployment

#### Option 1: Docker

```bash
cd backend

# Build the Docker image
docker build -t festify-backend .

# Run the container
docker run -p 8080:8080 --env-file .env festify-backend
```

#### Option 2: Traditional Deployment

```bash
# Build the JAR
./mvnw clean package -DskipTests

# Run on server
java -jar target/festify-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
cd frontend/festify

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker

```bash
cd frontend/festify

# Build and run
docker build -t festify-frontend .
docker run -p 3000:3000 festify-frontend
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- **Backend:** Database credentials, JWT secret, SMTP config
- **Frontend:** Supabase URL and keys, API URL

## 📁 Project Structure

```
festify-application/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend/
│   │   │   │   ├── controller/        # REST Controllers
│   │   │   │   ├── entity/            # JPA Entities
│   │   │   │   ├── repository/        # Data Repositories
│   │   │   │   ├── security/          # Security Config
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                      # Unit tests
│   ├── Dockerfile
│   ├── pom.xml                        # Maven dependencies
│   ├── start-backend.ps1              # Startup script
│   └── test.ps1                       # API test script
│
├── frontend/festify/
│   ├── src/
│   │   ├── app/                       # Next.js app routes
│   │   │   ├── (auth)/               # Auth pages
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── events/               # Event pages
│   │   │   ├── profile/              # User profile
│   │   │   └── ...
│   │   ├── components/               # React components
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   └── ...
│   │   ├── lib/                      # Utilities
│   │   │   └── supabase/             # Supabase client
│   │   ├── context/                  # React Context
│   │   ├── hooks/                    # Custom hooks
│   │   └── utils/
│   │       └── apiClient.ts          # API client with JWT
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── scripts/
│   └── fix-database-structure.sql    # Database setup
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
│
├── .gitignore
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- **Java**: Follow Google Java Style Guide
- **TypeScript**: Use ESLint and Prettier
- **Commits**: Use conventional commits (feat, fix, docs, etc.)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Rishika Raj** - [@rishikaraj14](https://github.com/rishikaraj14)

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for event updates
- [ ] QR code ticket generation
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Event recommendation system
- [ ] Chat support for organizers

---

**Made with ❤️ for college fest management**