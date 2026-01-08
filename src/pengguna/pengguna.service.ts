import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenggunaDto, UpdateStatusPenggunaDto } from './dto/pengguna.dto';

@Injectable()
export class PenggunaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pengguna.findMany({
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        aktif: true,
        dibuatPada: true,
      },
    });
  }

  async create(createPenggunaDto: CreatePenggunaDto) {
    const penggunaAda = await this.prisma.pengguna.findUnique({
      where: { username: createPenggunaDto.username },
    });

    if (penggunaAda) {
      throw new ConflictException('Username sudah digunakan');
    }

    const hashKataSandi = await bcrypt.hash(createPenggunaDto.kataSandi, 10);

    return this.prisma.pengguna.create({
      data: {
        nama: createPenggunaDto.nama,
        username: createPenggunaDto.username,
        hashKataSandi,
        role: createPenggunaDto.role,
      },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        aktif: true,
        dibuatPada: true,
      },
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusPenggunaDto) {
    return this.prisma.pengguna.update({
      where: { id },
      data: updateStatusDto,
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        aktif: true,
      },
    });
  }

  async resetKataSandi(id: string) {
    const hashKataSandi = await bcrypt.hash('password123', 10);
    return this.prisma.pengguna.update({
      where: { id },
      data: { hashKataSandi },
      select: {
        id: true,
        nama: true,
        username: true,
      },
    });
  }
}
