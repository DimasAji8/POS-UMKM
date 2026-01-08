import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenyesuaianStokDto } from './dto/stok.dto';
import { TipePenyesuaian } from '@prisma/client';

@Injectable()
export class StokService {
  constructor(private prisma: PrismaService) {}

  async createPenyesuaian(createPenyesuaianDto: CreatePenyesuaianStokDto, idPengguna: string) {
    return this.prisma.$transaction(async (tx) => {
      const produk = await tx.produk.findUnique({
        where: { id: createPenyesuaianDto.idProduk },
      });

      if (!produk) {
        throw new NotFoundException('Produk tidak ditemukan');
      }

      if (createPenyesuaianDto.tipe === TipePenyesuaian.KELUAR && 
          produk.stok < createPenyesuaianDto.jumlah) {
        throw new BadRequestException('Stok tidak cukup untuk penyesuaian KELUAR');
      }

      const penyesuaian = await tx.penyesuaianStok.create({
        data: {
          idProduk: createPenyesuaianDto.idProduk,
          idPengguna,
          tipe: createPenyesuaianDto.tipe,
          jumlah: createPenyesuaianDto.jumlah,
          catatan: createPenyesuaianDto.catatan,
        },
        include: {
          produk: { select: { nama: true, kode: true } },
          pengguna: { select: { nama: true } },
        },
      });

      const perubahanStok = createPenyesuaianDto.tipe === TipePenyesuaian.MASUK 
        ? createPenyesuaianDto.jumlah 
        : -createPenyesuaianDto.jumlah;

      await tx.produk.update({
        where: { id: createPenyesuaianDto.idProduk },
        data: { stok: { increment: perubahanStok } },
      });

      return penyesuaian;
    });
  }

  async findAllPenyesuaian(
    halaman = 1,
    batas = 10,
    idProduk?: string,
    tipe?: TipePenyesuaian,
    tanggalDari?: string,
    tanggalSampai?: string,
  ) {
    const lewati = (halaman - 1) * batas;
    const where: any = {};

    if (idProduk) where.idProduk = idProduk;
    if (tipe) where.tipe = tipe;

    if (tanggalDari || tanggalSampai) {
      where.dibuatPada = {};
      if (tanggalDari) where.dibuatPada.gte = new Date(tanggalDari);
      if (tanggalSampai) where.dibuatPada.lte = new Date(tanggalSampai);
    }

    const [penyesuaian, total] = await Promise.all([
      this.prisma.penyesuaianStok.findMany({
        where,
        skip: lewati,
        take: batas,
        orderBy: { dibuatPada: 'desc' },
        include: {
          produk: { select: { nama: true, kode: true } },
          pengguna: { select: { nama: true } },
        },
      }),
      this.prisma.penyesuaianStok.count({ where }),
    ]);

    return {
      data: penyesuaian,
      meta: {
        total,
        halaman,
        batas,
        totalHalaman: Math.ceil(total / batas),
      },
    };
  }
}
