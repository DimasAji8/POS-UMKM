import { Injectable } from '@nestjs/common';
import { createObjectCsvStringifier } from 'csv-writer';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportTransactionsCSV(startDate?: string, endDate?: string): Promise<string> {
    const where: any = {};
    if (startDate || endDate) {
      where.dibuatPada = {};
      if (startDate) where.dibuatPada.gte = new Date(startDate);
      if (endDate) where.dibuatPada.lte = new Date(endDate);
    }

    const transactions = await this.prisma.penjualan.findMany({
      where,
      include: {
        kasir: { select: { nama: true } },
        itemPenjualan: true,
      },
      orderBy: { dibuatPada: 'desc' },
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'noFaktur', title: 'Invoice No' },
        { id: 'tanggal', title: 'Date' },
        { id: 'kasir', title: 'Cashier' },
        { id: 'total', title: 'Total' },
        { id: 'jumlahBayar', title: 'Payment' },
        { id: 'jumlahKembalian', title: 'Change' },
      ],
    });

    const records = transactions.map(t => ({
      noFaktur: t.noFaktur,
      tanggal: t.dibuatPada.toISOString(),
      kasir: t.kasir.nama,
      total: Number(t.total),
      jumlahBayar: Number(t.jumlahBayar),
      jumlahKembalian: Number(t.jumlahKembalian),
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }

  async exportProductsCSV(): Promise<string> {
    const products = await this.prisma.produk.findMany({
      orderBy: { nama: 'asc' },
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'kode', title: 'SKU' },
        { id: 'nama', title: 'Name' },
        { id: 'kategori', title: 'Category' },
        { id: 'harga', title: 'Price' },
        { id: 'stok', title: 'Stock' },
        { id: 'aktif', title: 'Active' },
      ],
    });

    const records = products.map(p => ({
      kode: p.kode,
      nama: p.nama,
      kategori: p.kategori || '',
      harga: Number(p.harga),
      stok: p.stok,
      aktif: p.aktif ? 'Yes' : 'No',
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }

  async exportSalesSummaryPDF(startDate: string, endDate: string): Promise<Buffer> {
    const hasil = await this.prisma.penjualan.aggregate({
      where: {
        dibuatPada: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      _count: { id: true },
      _sum: { total: true },
    });

    const topProducts = await this.prisma.itemPenjualan.groupBy({
      by: ['namaProduk'],
      where: {
        penjualan: {
          dibuatPada: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
      _sum: { jumlah: true, subtotal: true },
      orderBy: { _sum: { jumlah: 'desc' } },
      take: 10,
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Sales Summary Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
      doc.moveDown();

      doc.fontSize(14).text('Summary', { underline: true });
      doc.fontSize(11);
      doc.text(`Total Transactions: ${hasil._count.id}`);
      doc.text(`Total Revenue: Rp ${Number(hasil._sum.total || 0).toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(14).text('Top 10 Products', { underline: true });
      doc.fontSize(10);
      topProducts.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.namaProduk} - Qty: ${item._sum.jumlah} - Revenue: Rp ${Number(item._sum.subtotal).toLocaleString()}`
        );
      });

      doc.end();
    });
  }

  async exportTransactionsPDF(startDate?: string, endDate?: string): Promise<Buffer> {
    const where: any = {};
    if (startDate || endDate) {
      where.dibuatPada = {};
      if (startDate) where.dibuatPada.gte = new Date(startDate);
      if (endDate) where.dibuatPada.lte = new Date(endDate);
    }

    const transactions = await this.prisma.penjualan.findMany({
      where,
      include: { kasir: { select: { nama: true } } },
      orderBy: { dibuatPada: 'desc' },
      take: 100,
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Transactions Report', { align: 'center' });
      doc.moveDown();
      if (startDate && endDate) {
        doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
        doc.moveDown();
      }

      doc.fontSize(10);
      transactions.forEach((t) => {
        doc.text(
          `${t.noFaktur} | ${t.dibuatPada.toLocaleDateString()} | ${t.kasir.nama} | Rp ${Number(t.total).toLocaleString()}`
        );
      });

      doc.end();
    });
  }
}
