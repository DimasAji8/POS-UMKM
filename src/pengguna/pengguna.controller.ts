import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PenggunaService } from './pengguna.service';
import { CreatePenggunaDto, UpdatePenggunaDto, UpdateStatusPenggunaDto } from './dto/pengguna.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Pengguna')
@Controller('pengguna')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PenggunaController {
  constructor(private penggunaService: PenggunaService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lihat daftar pengguna',
    description: '🔒 ADMIN ONLY - Mengambil semua data pengguna.',
  })
  @ApiResponse({ status: 200, description: 'Daftar semua pengguna' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  findAll() {
    return this.penggunaService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Buat pengguna baru',
    description: '🔒 ADMIN ONLY - Membuat pengguna baru.',
  })
  @ApiResponse({ status: 201, description: 'Pengguna berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Username sudah digunakan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  async create(@Body() createPenggunaDto: CreatePenggunaDto) {
    const data = await this.penggunaService.create(createPenggunaDto);
    return { success: true, message: 'User berhasil ditambahkan', data };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update pengguna', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID pengguna' })
  async update(@Param('id') id: string, @Body() updatePenggunaDto: UpdatePenggunaDto) {
    const data = await this.penggunaService.update(id, updatePenggunaDto);
    return { success: true, message: 'User berhasil diupdate', data };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Hapus pengguna', description: '🔒 ADMIN ONLY' })
  @ApiParam({ name: 'id', description: 'ID pengguna' })
  async delete(@Param('id') id: string) {
    await this.penggunaService.delete(id);
    return { success: true, message: 'User berhasil dihapus' };
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update status pengguna',
    description: '🔒 ADMIN ONLY - Mengaktifkan atau menonaktifkan pengguna.',
  })
  @ApiParam({ name: 'id', description: 'ID pengguna' })
  @ApiResponse({ status: 200, description: 'Status berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusPenggunaDto) {
    return this.penggunaService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/reset-kata-sandi')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Reset kata sandi pengguna',
    description: '🔒 ADMIN ONLY - Mereset kata sandi ke default.',
  })
  @ApiParam({ name: 'id', description: 'ID pengguna' })
  @ApiResponse({ status: 200, description: 'Kata sandi berhasil direset' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  resetKataSandi(@Param('id') id: string) {
    return this.penggunaService.resetKataSandi(id);
  }
}
