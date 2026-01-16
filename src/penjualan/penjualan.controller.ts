import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PenjualanService } from './penjualan.service';
import { CreatePenjualanDto } from './dto/penjualan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Penjualan')
@Controller('penjualan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PenjualanController {
  constructor(private penjualanService: PenjualanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.KASIR)
  @ApiOperation({
    summary: 'Buat transaksi penjualan',
    description: 'Membuat transaksi penjualan baru. Stok produk akan otomatis berkurang.',
  })
  @ApiResponse({ status: 201, description: 'Transaksi berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Stok tidak mencukupi atau produk tidak aktif' })
  async create(@Body() createPenjualanDto: CreatePenjualanDto, @Request() req) {
    const data = await this.penjualanService.create(createPenjualanDto, req.user.id);
    return { success: true, message: 'Transaksi berhasil', data };
  }

  @Get()
  @ApiOperation({
    summary: 'Lihat daftar penjualan',
    description: 'ADMIN melihat semua, KASIR hanya transaksinya sendiri.',
  })
  @ApiQuery({ name: 'halaman', required: false, description: 'Nomor halaman (default: 1)' })
  @ApiQuery({ name: 'batas', required: false, description: 'Jumlah per halaman (default: 10)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter dari tanggal (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter sampai tanggal (YYYY-MM-DD)' })
  @ApiQuery({ name: 'noFaktur', required: false, description: 'Cari nomor faktur' })
  @ApiQuery({ name: 'cashierId', required: false, description: 'Filter ID kasir (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Daftar penjualan dengan paginasi' })
  findAll(
    @Request() req,
    @Query('halaman') halaman?: string,
    @Query('batas') batas?: string,
    @Query('startDate') tanggalDari?: string,
    @Query('endDate') tanggalSampai?: string,
    @Query('noFaktur') noFaktur?: string,
    @Query('cashierId') idKasir?: string,
  ) {
    return this.penjualanService.findAll(
      req.user.id,
      req.user.role,
      parseInt(halaman) || 1,
      parseInt(batas) || 10,
      tanggalDari,
      tanggalSampai,
      noFaktur,
      idKasir,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lihat detail penjualan',
    description: 'ADMIN melihat semua, KASIR hanya transaksinya sendiri.',
  })
  @ApiParam({ name: 'id', description: 'ID penjualan' })
  @ApiResponse({ status: 200, description: 'Detail penjualan' })
  @ApiResponse({ status: 404, description: 'Penjualan tidak ditemukan' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.penjualanService.findOne(id, req.user.id, req.user.role);
  }
}
