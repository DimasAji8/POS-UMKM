import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.kategori.findMany({
      where: { aktif: true },
      orderBy: { nama: 'asc' },
    });
  }

  async create(nama: string) {
    const existing = await this.prisma.kategori.findUnique({ where: { nama } });
    if (existing) {
      throw new ConflictException('Kategori sudah ada');
    }
    return this.prisma.kategori.create({ data: { nama } });
  }

  async update(id: string, nama: string) {
    const kategori = await this.prisma.kategori.findUnique({ where: { id } });
    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }
    return this.prisma.kategori.update({ where: { id }, data: { nama } });
  }

  async delete(id: string) {
    const kategori = await this.prisma.kategori.findUnique({ where: { id } });
    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }
    
    // Cek apakah ada produk yang pakai kategori ini
    const produkCount = await this.prisma.produk.count({ where: { idKategori: id } });
    if (produkCount > 0) {
      throw new ConflictException(`Tidak dapat menghapus kategori. Ada ${produkCount} produk yang menggunakan kategori ini`);
    }
    
    return this.prisma.kategori.delete({ where: { id } });
  }
}
