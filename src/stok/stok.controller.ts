import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StokService } from './stok.service';
import { CreatePenyesuaianStokDto } from './dto/stok.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, TipePenyesuaian } from '@prisma/client';

@ApiTags('Stok')
@Controller('stok')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class StokController {
  constructor(private stokService: StokService) {}

  @Post('penyesuaian')
  @ApiOperation({
    summary: 'Buat penyesuaian stok',
    description: '🔒 ADMIN ONLY - Menambah (MASUK) atau mengurangi (KELUAR) stok produk secara manual.',
  })
  @ApiResponse({ status: 201, description: 'Penyesuaian stok berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Stok tidak mencukupi untuk pengurangan' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  createPenyesuaian(@Body() createPenyesuaianDto: CreatePenyesuaianStokDto, @Request() req) {
    return this.stokService.createPenyesuaian(createPenyesuaianDto, req.user.id);
  }

  @Get('penyesuaian')
  @ApiOperation({
    summary: 'Lihat riwayat penyesuaian stok',
    description: '🔒 ADMIN ONLY - Mengambil riwayat semua penyesuaian stok dengan filter.',
  })
  @ApiQuery({ name: 'halaman', required: false, description: 'Nomor halaman (default: 1)' })
  @ApiQuery({ name: 'batas', required: false, description: 'Jumlah data per halaman (default: 10)' })
  @ApiQuery({ name: 'idProduk', required: false, description: 'Filter berdasarkan ID produk' })
  @ApiQuery({ name: 'tipe', required: false, enum: TipePenyesuaian, description: 'Filter berdasarkan tipe (MASUK/KELUAR)' })
  @ApiQuery({ name: 'tanggalDari', required: false, description: 'Filter dari tanggal (YYYY-MM-DD)' })
  @ApiQuery({ name: 'tanggalSampai', required: false, description: 'Filter sampai tanggal (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Daftar penyesuaian stok dengan paginasi' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  findAllPenyesuaian(
    @Query('halaman') halaman?: string,
    @Query('batas') batas?: string,
    @Query('idProduk') idProduk?: string,
    @Query('tipe') tipe?: TipePenyesuaian,
    @Query('tanggalDari') tanggalDari?: string,
    @Query('tanggalSampai') tanggalSampai?: string,
  ) {
    return this.stokService.findAllPenyesuaian(
      parseInt(halaman) || 1,
      parseInt(batas) || 10,
      idProduk,
      tipe,
      tanggalDari,
      tanggalSampai,
    );
  }
}
