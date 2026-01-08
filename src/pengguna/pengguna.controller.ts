import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PenggunaService } from './pengguna.service';
import { CreatePenggunaDto, UpdateStatusPenggunaDto } from './dto/pengguna.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('pengguna')
@Controller('pengguna')
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
  create(@Body() createPenggunaDto: CreatePenggunaDto) {
    return this.penggunaService.create(createPenggunaDto);
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
