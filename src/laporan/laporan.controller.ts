import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LaporanService } from './laporan.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class LaporanController {
  constructor(
    private laporanService: LaporanService,
    private exportService: ExportService,
  ) {}

  @Get('sales-summary')
  ringkasanPenjualan(
    @Query('startDate') tanggalDari: string,
    @Query('endDate') tanggalSampai: string,
  ) {
    return this.laporanService.ringkasanPenjualan(tanggalDari, tanggalSampai);
  }

  @Get('top-products')
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

