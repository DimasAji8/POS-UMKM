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
        { kategori: { nama: { contains: cari } } },
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
        include: { kategoriRelasi: true },
        orderBy: { dibuatPada: 'desc' },
      }),
      this.prisma.produk.count({ where }),
    ]);

    // Map response untuk include kategori name
    const mappedProduk = produk.map(p => ({
      ...p,
      kategori: p.kategoriRelasi?.nama || p.kategori || null,
    }));

    return {
      data: mappedProduk,
      meta: {
        total,
        halaman,
        batas,
        totalHalaman: Math.ceil(total / batas),
      },
    };
  }

  async findOne(id: string) {
    const produk = await this.prisma.produk.findUnique({ 
      where: { id },
      include: { kategoriRelasi: true }
    });
    if (!produk) {
      throw new NotFoundException('Produk tidak ditemukan');
    }
    return {
      ...produk,
      kategori: produk.kategoriRelasi?.nama || produk.kategori || null,
    };
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

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.produk.delete({ where: { id } });
    return { message: 'Produk berhasil dihapus' };
  }

  async adjustStock(id: string, adjustment: number) {
    const produk = await this.findOne(id);
    const newStock = produk.stok + adjustment;

    if (newStock < 0) {
      throw new ConflictException('Stok tidak boleh negatif');
    }

    const updated = await this.prisma.produk.update({
      where: { id },
      data: { stok: newStock },
    });

    return {
      id: updated.id,
      name: updated.nama,
      stock: updated.stok,
      previousStock: produk.stok,
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusProdukDto) {
    await this.findOne(id);
    return this.prisma.produk.update({
      where: { id },
      data: updateStatusDto,
    });
  }
}

