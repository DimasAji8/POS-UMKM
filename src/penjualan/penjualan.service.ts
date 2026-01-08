import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenjualanDto } from './dto/penjualan.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PenjualanService {
  constructor(private prisma: PrismaService) {}

  async create(createPenjualanDto: CreatePenjualanDto, idKasir: string) {
    return this.prisma.$transaction(async (tx) => {
      const idProdukList = createPenjualanDto.item.map(item => item.idProduk);
      const produkList = await tx.produk.findMany({
        where: { id: { in: idProdukList }, aktif: true },
      });

      if (produkList.length !== idProdukList.length) {
        throw new BadRequestException('Beberapa produk tidak ditemukan atau tidak aktif');
      }

      let total = 0;
      const itemPenjualan = [];

      for (const item of createPenjualanDto.item) {
        const produk = produkList.find(p => p.id === item.idProduk);
        if (produk.stok < item.jumlah) {
          throw new BadRequestException(`Stok tidak cukup untuk ${produk.nama}`);
        }

        const subtotal = produk.harga.toNumber() * item.jumlah;
        total += subtotal;

        itemPenjualan.push({
          idProduk: item.idProduk,
          kode: produk.kode,
          namaProduk: produk.nama,
          jumlah: item.jumlah,
          harga: produk.harga,
          subtotal,
        });
      }

      if (createPenjualanDto.jumlahBayar < total) {
        throw new BadRequestException('Jumlah bayar kurang dari total');
      }

      const jumlahKembalian = createPenjualanDto.jumlahBayar - total;

      const hariIni = new Date();
      const tanggalStr = hariIni.toISOString().slice(0, 10).replace(/-/g, '');
      const penjualanTerakhir = await tx.penjualan.findFirst({
        where: { noFaktur: { startsWith: `FAK-${tanggalStr}` } },
        orderBy: { noFaktur: 'desc' },
      });

      let urutan = 1;
      if (penjualanTerakhir) {
        const urutanTerakhir = parseInt(penjualanTerakhir.noFaktur.split('-')[2]);
        urutan = urutanTerakhir + 1;
      }

      const noFaktur = `FAK-${tanggalStr}-${urutan.toString().padStart(4, '0')}`;

      const penjualan = await tx.penjualan.create({
        data: {
          noFaktur,
          idKasir,
          total,
          jumlahBayar: createPenjualanDto.jumlahBayar,
          jumlahKembalian,
          itemPenjualan: {
            create: itemPenjualan,
          },
        },
        include: { itemPenjualan: true },
      });

      for (const item of createPenjualanDto.item) {
        await tx.produk.update({
          where: { id: item.idProduk },
          data: { stok: { decrement: item.jumlah } },
        });
      }

      return {
        idPenjualan: penjualan.id,
        noFaktur: penjualan.noFaktur,
        total: penjualan.total,
        jumlahBayar: penjualan.jumlahBayar,
        jumlahKembalian: penjualan.jumlahKembalian,
      };
    });
  }

  async findAll(
    idPengguna: string,
    rolePengguna: Role,
    halaman = 1,
    batas = 10,
    tanggalDari?: string,
    tanggalSampai?: string,
    noFaktur?: string,
    idKasir?: string,
  ) {
    const lewati = (halaman - 1) * batas;
    const where: any = {};

    if (rolePengguna === Role.KASIR) {
      where.idKasir = idPengguna;
    } else if (idKasir) {
      where.idKasir = idKasir;
    }

    if (tanggalDari || tanggalSampai) {
      where.dibuatPada = {};
      if (tanggalDari) where.dibuatPada.gte = new Date(tanggalDari);
      if (tanggalSampai) where.dibuatPada.lte = new Date(tanggalSampai);
    }

    if (noFaktur) {
      where.noFaktur = { contains: noFaktur };
    }

    const [penjualan, total] = await Promise.all([
      this.prisma.penjualan.findMany({
        where,
        skip: lewati,
        take: batas,
        orderBy: { dibuatPada: 'desc' },
        include: {
          kasir: { select: { nama: true } },
          itemPenjualan: true,
        },
      }),
      this.prisma.penjualan.count({ where }),
    ]);

    return {
      data: penjualan,
      meta: {
        total,
        halaman,
        batas,
        totalHalaman: Math.ceil(total / batas),
      },
    };
  }

  async findOne(id: string, idPengguna: string, rolePengguna: Role) {
    const penjualan = await this.prisma.penjualan.findUnique({
      where: { id },
      include: {
        kasir: { select: { nama: true } },
        itemPenjualan: true,
      },
    });

    if (!penjualan) {
      throw new NotFoundException('Penjualan tidak ditemukan');
    }

    if (rolePengguna === Role.KASIR && penjualan.idKasir !== idPengguna) {
      throw new ForbiddenException('Akses ditolak');
    }

    return penjualan;
  }
}
