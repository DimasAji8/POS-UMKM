import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { StokModule } from './stok/stok.module';
import { LaporanModule } from './laporan/laporan.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PenggunaModule,
    ProdukModule,
    PenjualanModule,
    StokModule,
    LaporanModule,
    CategoriesModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
