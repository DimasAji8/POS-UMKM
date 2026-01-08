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
- Kata Sandi: `admin123`

## API Endpoints

### Autentikasi
- `POST /autentikasi/login` - Login
- `GET /autentikasi/profil` - Ambil profil
- `POST /autentikasi/ubah-kata-sandi` - Ubah kata sandi

### Pengguna (ADMIN only)
- `GET /pengguna` - Daftar pengguna
- `POST /pengguna` - Buat pengguna
- `PATCH /pengguna/:id/status` - Update status pengguna
- `PATCH /pengguna/:id/reset-kata-sandi` - Reset kata sandi

### Produk
- `GET /produk` - Daftar produk (dengan cari, filter, paginasi)
- `GET /produk/:id` - Detail produk
- `POST /produk` - Buat produk (ADMIN)
- `PATCH /produk/:id` - Update produk (ADMIN)
- `PATCH /produk/:id/status` - Update status produk (ADMIN)

### Penjualan
- `POST /penjualan` - Buat penjualan (ADMIN/KASIR)
- `GET /penjualan` - Daftar penjualan (dengan filter)
- `GET /penjualan/:id` - Detail penjualan

### Stok (ADMIN only)
- `POST /stok/penyesuaian` - Buat penyesuaian stok
- `GET /stok/penyesuaian` - Daftar penyesuaian stok

### Laporan (ADMIN only)
- `GET /laporan/ringkasan-penjualan` - Ringkasan penjualan
- `GET /laporan/produk-terlaris` - Produk terlaris

## Fitur

- Autentikasi JWT
- Kontrol akses berbasis peran (ADMIN/KASIR)
- Transaksi atomik untuk penjualan
- Manajemen stok
- Pembuatan faktur
- Laporan komprehensif
- Validasi input
- Dukungan paginasi
