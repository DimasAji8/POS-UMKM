import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PenggunaService } from './pengguna.service';
import { CreatePenggunaDto, UpdatePenggunaDto, UpdateStatusPenggunaDto } from './dto/pengguna.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PenggunaController {
  constructor(private penggunaService: PenggunaService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.penggunaService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createPenggunaDto: CreatePenggunaDto) {
    const data = await this.penggunaService.create(createPenggunaDto);
    return {
      success: true,
      message: 'User berhasil ditambahkan',
      data,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updatePenggunaDto: UpdatePenggunaDto) {
    const data = await this.penggunaService.update(id, updatePenggunaDto);
    return {
      success: true,
      message: 'User berhasil diupdate',
      data,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    await this.penggunaService.delete(id);
    return {
      success: true,
      message: 'User berhasil dihapus',
    };
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusPenggunaDto) {
    return this.penggunaService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/reset-kata-sandi')
  @Roles(Role.ADMIN)
  resetKataSandi(@Param('id') id: string) {
    return this.penggunaService.resetKataSandi(id);
  }
}
