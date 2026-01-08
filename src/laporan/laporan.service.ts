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

    return {
      totalTransaksi: hasil._count.id,
      totalPendapatan: hasil._sum.total || 0,
      tanggalDari,
      tanggalSampai,
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
      idProduk: item.idProduk,
      namaProduk: item.namaProduk,
      totalJumlah: item._sum.jumlah,
      totalPendapatan: item._sum.subtotal,
    }));
  }
}
