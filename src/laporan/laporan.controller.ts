import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LaporanService } from './laporan.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Laporan')
@Controller('laporan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class LaporanController {
  constructor(
    private laporanService: LaporanService,
    private exportService: ExportService,
  ) {}

  @Get('ringkasan-penjualan')
  @ApiOperation({
    summary: 'Lihat ringkasan penjualan',
    description: '🔒 ADMIN ONLY - Laporan ringkasan penjualan berdasarkan periode.',
  })
  @ApiQuery({ name: 'startDate', required: true, description: 'Tanggal mulai (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Tanggal akhir (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Ringkasan penjualan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  ringkasanPenjualan(
    @Query('startDate') tanggalDari: string,
    @Query('endDate') tanggalSampai: string,
  ) {
    return this.laporanService.ringkasanPenjualan(tanggalDari, tanggalSampai);
  }

  @Get('produk-terlaris')
  @ApiOperation({
    summary: 'Lihat produk terlaris',
    description: '🔒 ADMIN ONLY - Laporan produk dengan penjualan terbanyak.',
  })
  @ApiQuery({ name: 'startDate', required: false, description: 'Tanggal mulai (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Tanggal akhir (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Jumlah produk (default: 10)' })
  @ApiResponse({ status: 200, description: 'Daftar produk terlaris' })
  @ApiResponse({ status: 403, description: 'Akses ditolak, hanya ADMIN' })
  produkTerlaris(
    @Query('startDate') tanggalDari?: string,
    @Query('endDate') tanggalSampai?: string,
    @Query('limit') batas?: string,
  ) {
    return this.laporanService.produkTerlaris(tanggalDari, tanggalSampai, parseInt(batas) || 10);
  }

  @Get('low-stock')
  lowStock(@Query('threshold') threshold?: string) {
    return this.laporanService.lowStockProducts(parseInt(threshold) || 10);
  }

  @Get('export')
  async export(
    @Query('format') format: string,
    @Query('type') type: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    if (format === 'csv') {
      let csvData: string;
      
      if (type === 'transactions') {
        csvData = await this.exportService.exportTransactionsCSV(startDate, endDate);
      } else if (type === 'products') {
        csvData = await this.exportService.exportProductsCSV();
      } else {
        return res.status(400).json({ success: false, message: 'Invalid type' });
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-${Date.now()}.csv"`);
      return res.send(csvData);
    } else if (format === 'pdf') {
      let pdfBuffer: Buffer;

      if (type === 'transactions') {
        pdfBuffer = await this.exportService.exportTransactionsPDF(startDate, endDate);
      } else if (type === 'sales-summary') {
        if (!startDate || !endDate) {
          return res.status(400).json({ success: false, message: 'startDate and endDate required' });
        }
        pdfBuffer = await this.exportService.exportSalesSummaryPDF(startDate, endDate);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid type' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-${Date.now()}.pdf"`);
      return res.send(pdfBuffer);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid format' });
    }
  }
}
