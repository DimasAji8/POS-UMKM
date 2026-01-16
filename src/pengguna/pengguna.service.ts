import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenggunaDto, UpdatePenggunaDto, UpdateStatusPenggunaDto } from './dto/pengguna.dto';

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

  async update(id: string, updatePenggunaDto: UpdatePenggunaDto) {
    const pengguna = await this.prisma.pengguna.findUnique({ where: { id } });
    if (!pengguna) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (updatePenggunaDto.username && updatePenggunaDto.username !== pengguna.username) {
      const usernameAda = await this.prisma.pengguna.findUnique({
        where: { username: updatePenggunaDto.username },
      });
      if (usernameAda) {
        throw new ConflictException('Username sudah digunakan');
      }
    }

    const data: any = {
      nama: updatePenggunaDto.nama,
      username: updatePenggunaDto.username,
      role: updatePenggunaDto.role,
    };

    if (updatePenggunaDto.kataSandi) {
      data.hashKataSandi = await bcrypt.hash(updatePenggunaDto.kataSandi, 10);
    }

    return this.prisma.pengguna.update({
      where: { id },
      data,
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

  async delete(id: string) {
    const pengguna = await this.prisma.pengguna.findUnique({ where: { id } });
    if (!pengguna) {
      throw new NotFoundException('User tidak ditemukan');
    }

    await this.prisma.pengguna.delete({ where: { id } });
    return { message: 'User berhasil dihapus' };
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

