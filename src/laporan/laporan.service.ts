import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LaporanService {
  constructor(private prisma: PrismaService) {}

  async ringkasanPenjualan(tanggalDari: string, tanggalSampai: string) {
    const hasil = await this.prisma.penjualan.aggregate({
      where: {
        dibuatPada: {
          gte: new Date(tanggalDari),
          lte: new Date(tanggalSampai),
        },
      },
      _count: { id: true },
      _sum: { total: true },
    });

    const itemCount = await this.prisma.itemPenjualan.aggregate({
      where: {
        penjualan: {
          dibuatPada: {
            gte: new Date(tanggalDari),
            lte: new Date(tanggalSampai),
          },
        },
      },
      _sum: { jumlah: true },
    });

    const totalRevenue = hasil._sum.total ? Number(hasil._sum.total) : 0;
    const totalTransactions = hasil._count.id;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction: Math.round(averageTransaction),
      totalItems: itemCount._sum.jumlah || 0,
      period: {
        startDate: tanggalDari,
        endDate: tanggalSampai,
      },
    };
  }

  async produkTerlaris(tanggalDari?: string, tanggalSampai?: string, batas = 10) {
    const where: any = {};
    
    if (tanggalDari || tanggalSampai) {
      where.penjualan = {
        dibuatPada: {},
      };
      if (tanggalDari) where.penjualan.dibuatPada.gte = new Date(tanggalDari);
      if (tanggalSampai) where.penjualan.dibuatPada.lte = new Date(tanggalSampai);
    }

    const produkTerlaris = await this.prisma.itemPenjualan.groupBy({
      by: ['idProduk', 'namaProduk'],
      where,
      _sum: {
        jumlah: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          jumlah: 'desc',
        },
      },
      take: batas,
    });

    return produkTerlaris.map(item => ({
      productId: item.idProduk,
      productName: item.namaProduk,
      quantitySold: item._sum.jumlah,
      revenue: Number(item._sum.subtotal),
    }));
  }

  async lowStockProducts(threshold = 10) {
    const products = await this.prisma.produk.findMany({
      where: {
        stok: { lte: threshold },
        aktif: true,
      },
      orderBy: { stok: 'asc' },
    });

    return products.map(p => ({
      id: p.id,
      name: p.nama,
      stock: p.stok,
      categoryId: p.kategori || '',
      sku: p.kode,
    }));
  }
}
