import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto, UpdateStatusProdukDto } from './dto/produk.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Produk')
@Controller('produk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get()
  @ApiOperation({
    summary: 'Lihat daftar produk',
    description: 'Mengambil semua produk dengan pencarian, filter, dan paginasi.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Kata kunci pencarian' })
  @ApiQuery({ name: 'aktif', required: false, description: 'Filter status aktif (true/false)' })
  @ApiQuery({ name: 'halaman', required: false, description: 'Nomor halaman (default: 1)' })
  @ApiQuery({ name: 'batas', required: false, description: 'Jumlah per halaman (default: 10)' })
  @ApiResponse({ status: 200, description: 'Daftar produk dengan paginasi' })
  findAll(
    @Query('search') cari?: string,
    @Query('aktif') aktif?: string,
    @Query('halaman') halaman?: string,
    @Query('batas') batas?: string,
  ) {
    return this.produkService.findAll(
      cari,
      aktif === 'true' ? true : aktif === 'false' ? false : undefined,
      parseInt(halaman) || 1,
      parseInt(batas) || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail produk' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  @ApiResponse({ status: 200, description: 'Detail produk' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buat produk baru', description: '🔒 ADMIN ONLY' })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Kode produk sudah digunakan' })
  async create(@Body() createProdukDto: CreateProdukDto) {
    const data = await this.produkService.create(createProdukDto);
    return { success: true, message: 'Produk berhasil ditambahkan', data };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update produk', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  async update(@Param('id') id: string, @Body() updateProdukDto: UpdateProdukDto) {
    const data = await this.produkService.update(id, updateProdukDto);
    return { success: true, message: 'Produk berhasil diupdate', data };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Hapus produk', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  async delete(@Param('id') id: string) {
    await this.produkService.delete(id);
    return { success: true, message: 'Produk berhasil dihapus' };
  }

  @Patch(':id/stock')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Adjust stok produk', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  async adjustStock(@Param('id') id: string, @Body('adjustment') adjustment: number) {
    const data = await this.produkService.adjustStock(id, adjustment);
    return { success: true, message: 'Stok berhasil diupdate', data };
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update status produk', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  @ApiResponse({ status: 200, description: 'Status berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusProdukDto) {
    return this.produkService.updateStatus(id, updateStatusDto);
  }
}
