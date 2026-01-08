import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdukDto, UpdateProdukDto, UpdateStatusProdukDto } from './dto/produk.dto';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  async findAll(cari?: string, aktif?: boolean, halaman = 1, batas = 10) {
    const lewati = (halaman - 1) * batas;
    const where: any = {};

    if (cari) {
      where.OR = [
        { nama: { contains: cari } },
        { kode: { contains: cari } },
        { kategori: { contains: cari } },
      ];
    }

    if (aktif !== undefined) {
      where.aktif = aktif;
    }

    const [produk, total] = await Promise.all([
      this.prisma.produk.findMany({
        where,
        skip: lewati,
        take: batas,
        orderBy: { dibuatPada: 'desc' },
      }),
      this.prisma.produk.count({ where }),
    ]);

    return {
      data: produk,
      meta: {
        total,
        halaman,
        batas,
        totalHalaman: Math.ceil(total / batas),
      },
    };
  }

  async findOne(id: string) {
    const produk = await this.prisma.produk.findUnique({ where: { id } });
    if (!produk) {
      throw new NotFoundException('Produk tidak ditemukan');
    }
    return produk;
  }

  async create(createProdukDto: CreateProdukDto) {
    const produkAda = await this.prisma.produk.findUnique({
      where: { kode: createProdukDto.kode },
    });

    if (produkAda) {
      throw new ConflictException('Kode produk sudah digunakan');
    }

    return this.prisma.produk.create({
      data: createProdukDto,
    });
  }

  async update(id: string, updateProdukDto: UpdateProdukDto) {
    await this.findOne(id);
    return this.prisma.produk.update({
      where: { id },
      data: updateProdukDto,
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusProdukDto) {
    await this.findOne(id);
    return this.prisma.produk.update({
      where: { id },
      data: updateStatusDto,
    });
  }
}
