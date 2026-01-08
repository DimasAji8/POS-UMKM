import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('laporan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class LaporanController {
  constructor(private laporanService: LaporanService) {}

  @Get('ringkasan-penjualan')
  ringkasanPenjualan(
    @Query('tanggalDari') tanggalDari: string,
    @Query('tanggalSampai') tanggalSampai: string,
  ) {
    return this.laporanService.ringkasanPenjualan(tanggalDari, tanggalSampai);
  }

  @Get('produk-terlaris')
  produkTerlaris(
    @Query('tanggalDari') tanggalDari?: string,
    @Query('tanggalSampai') tanggalSampai?: string,
    @Query('batas') batas?: string,
  ) {
    return this.laporanService.produkTerlaris(tanggalDari, tanggalSampai, parseInt(batas) || 10);
  }
}
