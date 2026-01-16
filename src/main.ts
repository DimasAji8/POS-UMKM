import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://fe-kasir-umkm.vercel.app',
      'https://kasir-hilyas.tech',
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Kasir UMKM API')
    .setDescription(`
## Deskripsi
Backend API untuk sistem Point of Sale (POS) UMKM.

## Aktor & Hak Akses

### 👤 ADMIN
Admin memiliki akses penuh ke semua fitur:
- ✅ Autentikasi (login, profil, ubah kata sandi)
- ✅ Manajemen Pengguna (CRUD pengguna, reset password)
- ✅ Manajemen Produk (CRUD produk)
- ✅ Transaksi Penjualan (buat, lihat semua)
- ✅ Manajemen Stok (penyesuaian stok)
- ✅ Laporan (ringkasan penjualan, produk terlaris)

### 👤 KASIR
Kasir memiliki akses terbatas:
- ✅ Autentikasi (login, profil, ubah kata sandi)
- ✅ Lihat Produk (daftar & detail)
- ✅ Transaksi Penjualan (buat, lihat milik sendiri)
- ❌ Manajemen Pengguna
- ❌ Kelola Produk
- ❌ Manajemen Stok
- ❌ Laporan

## Autentikasi
Gunakan endpoint \`POST /api/autentikasi/login\` untuk mendapatkan token JWT.
Sertakan token di header: \`Authorization: Bearer <token>\`

## Default Login
- Username: \`admin\`
- Password: \`admin123\`
    `)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autentikasi', 'Endpoint untuk login dan manajemen akun')
    .addTag('Pengguna', '🔒 ADMIN ONLY - Manajemen pengguna sistem')
    .addTag('Produk', 'Manajemen data produk')
    .addTag('Penjualan', 'Transaksi penjualan')
    .addTag('Stok', '🔒 ADMIN ONLY - Penyesuaian stok produk')
    .addTag('Laporan', '🔒 ADMIN ONLY - Laporan penjualan')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation: http://localhost:3000/api/docs');
}

bootstrap();
