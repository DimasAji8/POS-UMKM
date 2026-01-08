import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { StokModule } from './stok/stok.module';
import { LaporanModule } from './laporan/laporan.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PenggunaModule,
    ProdukModule,
    PenjualanModule,
    StokModule,
    LaporanModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
