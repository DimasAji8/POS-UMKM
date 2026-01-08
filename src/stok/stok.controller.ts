import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { StokService } from './stok.service';
import { CreatePenyesuaianStokDto } from './dto/stok.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, TipePenyesuaian } from '@prisma/client';

@Controller('stok')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StokController {
  constructor(private stokService: StokService) {}

  @Post('penyesuaian')
  createPenyesuaian(@Body() createPenyesuaianDto: CreatePenyesuaianStokDto, @Request() req) {
    return this.stokService.createPenyesuaian(createPenyesuaianDto, req.user.id);
  }

  @Get('penyesuaian')
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
