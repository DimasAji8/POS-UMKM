import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto, UpdateStatusProdukDto } from './dto/produk.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('produk')
@Controller('produk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua produk dengan paginasi dan filter' })
  @ApiQuery({ name: 'cari', required: false })
  @ApiQuery({ name: 'aktif', required: false })
  @ApiQuery({ name: 'halaman', required: false })
  @ApiQuery({ name: 'batas', required: false })
  findAll(
    @Query('cari') cari?: string,
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
  @ApiOperation({ summary: 'Ambil produk berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buat produk baru (ADMIN)' })
  create(@Body() createProdukDto: CreateProdukDto) {
    return this.produkService.create(createProdukDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update produk (ADMIN)' })
  update(@Param('id') id: string, @Body() updateProdukDto: UpdateProdukDto) {
    return this.produkService.update(id, updateProdukDto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update status produk (ADMIN)' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusProdukDto) {
    return this.produkService.updateStatus(id, updateStatusDto);
  }
}
