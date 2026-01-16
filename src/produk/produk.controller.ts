import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto, UpdateStatusProdukDto } from './dto/produk.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua produk dengan paginasi dan filter' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'aktif', required: false })
  @ApiQuery({ name: 'halaman', required: false })
  @ApiQuery({ name: 'batas', required: false })
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
  @ApiOperation({ summary: 'Ambil produk berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buat produk baru (ADMIN)' })
  async create(@Body() createProdukDto: CreateProdukDto) {
    const data = await this.produkService.create(createProdukDto);
    return {
      success: true,
      message: 'Produk berhasil ditambahkan',
      data,
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update produk (ADMIN)' })
  async update(@Param('id') id: string, @Body() updateProdukDto: UpdateProdukDto) {
    const data = await this.produkService.update(id, updateProdukDto);
    return {
      success: true,
      message: 'Produk berhasil diupdate',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete produk (ADMIN)' })
  async delete(@Param('id') id: string) {
    await this.produkService.delete(id);
    return {
      success: true,
      message: 'Produk berhasil dihapus',
    };
  }

  @Patch(':id/stock')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Adjust stock produk (ADMIN)' })
  async adjustStock(@Param('id') id: string, @Body('adjustment') adjustment: number) {
    const data = await this.produkService.adjustStock(id, adjustment);
    return {
      success: true,
      message: 'Stok berhasil diupdate',
      data,
    };
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update status produk (ADMIN)' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusProdukDto) {
    return this.produkService.updateStatus(id, updateStatusDto);
  }
}

