import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PenjualanService } from './penjualan.service';
import { CreatePenjualanDto } from './dto/penjualan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('penjualan')
@Controller('penjualan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PenjualanController {
  constructor(private penjualanService: PenjualanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.KASIR)
  @ApiOperation({ summary: 'Buat transaksi penjualan baru' })
  create(@Body() createPenjualanDto: CreatePenjualanDto, @Request() req) {
    return this.penjualanService.create(createPenjualanDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua penjualan dengan filter' })
  @ApiQuery({ name: 'halaman', required: false })
  @ApiQuery({ name: 'batas', required: false })
  @ApiQuery({ name: 'tanggalDari', required: false })
  @ApiQuery({ name: 'tanggalSampai', required: false })
  @ApiQuery({ name: 'noFaktur', required: false })
  @ApiQuery({ name: 'idKasir', required: false })
  findAll(
    @Request() req,
    @Query('halaman') halaman?: string,
    @Query('batas') batas?: string,
    @Query('tanggalDari') tanggalDari?: string,
    @Query('tanggalSampai') tanggalSampai?: string,
    @Query('noFaktur') noFaktur?: string,
    @Query('idKasir') idKasir?: string,
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
  @ApiOperation({ summary: 'Ambil penjualan berdasarkan ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.penjualanService.findOne(id, req.user.id, req.user.role);
  }
}
