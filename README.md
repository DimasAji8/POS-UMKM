# Kasir UMKM API

Backend API untuk sistem Point of Sale (POS) menggunakan NestJS, Prisma, dan MySQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
# Update DATABASE_URL di .env
# Jalankan migration
npm run migrate

# Seed data admin default
npm run seed
```

3. Start development:
```bash
npm run start:dev
```

## Default Admin
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Auth
- `POST /auth/login` - Login
- `GET /auth/me` - Get profile
- `POST /auth/change-password` - Change password

### Users (ADMIN only)
- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id/status` - Update user status
- `PATCH /users/:id/reset-password` - Reset password

### Products
- `GET /products` - List products (with search, filter, pagination)
- `GET /products/:id` - Get product detail
- `POST /products` - Create product (ADMIN)
- `PATCH /products/:id` - Update product (ADMIN)
- `PATCH /products/:id/status` - Update product status (ADMIN)

### Sales
- `POST /sales` - Create sale (ADMIN/CASHIER)
- `GET /sales` - List sales (with filters)
- `GET /sales/:id` - Get sale detail

### Stock (ADMIN only)
- `POST /stock/adjustments` - Create stock adjustment
- `GET /stock/adjustments` - List stock adjustments

### Reports (ADMIN only)
- `GET /reports/sales-summary` - Sales summary report
- `GET /reports/top-products` - Top products report

## Features

- JWT Authentication
- Role-based access control (ADMIN/CASHIER)
- Atomic transactions for sales
- Stock management
- Invoice generation
- Comprehensive reporting
- Input validation
- Pagination support
