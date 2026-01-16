import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PenjualanService } from './penjualan.service';
import { CreatePenjualanDto } from './dto/penjualan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PenjualanController {
  constructor(private penjualanService: PenjualanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.KASIR)
  @ApiOperation({ summary: 'Buat transaksi penjualan baru' })
  async create(@Body() createPenjualanDto: CreatePenjualanDto, @Request() req) {
    const data = await this.penjualanService.create(createPenjualanDto, req.user.id);
    return {
      success: true,
      message: 'Transaksi berhasil',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua penjualan dengan filter' })
  @ApiQuery({ name: 'halaman', required: false })
  @ApiQuery({ name: 'batas', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'noFaktur', required: false })
  @ApiQuery({ name: 'cashierId', required: false })
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
  @ApiOperation({ summary: 'Ambil penjualan berdasarkan ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.penjualanService.findOne(id, req.user.id, req.user.role);
  }
}
