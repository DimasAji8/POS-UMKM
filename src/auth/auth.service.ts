import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, UbahKataSandiDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const pengguna = await this.prisma.pengguna.findUnique({
      where: { username: loginDto.username },
    });

    if (!pengguna || !pengguna.aktif) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const kataSandiValid = await bcrypt.compare(loginDto.kataSandi, pengguna.hashKataSandi);
    if (!kataSandiValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const payload = { username: pengguna.username, sub: pengguna.id };
    return {
      accessToken: this.jwtService.sign(payload),
      pengguna: {
        id: pengguna.id,
        nama: pengguna.nama,
        username: pengguna.username,
        role: pengguna.role,
      },
    };
  }

  async ubahKataSandi(idPengguna: string, ubahKataSandiDto: UbahKataSandiDto) {
    const pengguna = await this.prisma.pengguna.findUnique({ where: { id: idPengguna } });
    
    const kataSandiSaatIniValid = await bcrypt.compare(
      ubahKataSandiDto.kataSandiSaatIni,
      pengguna.hashKataSandi,
    );
    if (!kataSandiSaatIniValid) {
      throw new UnauthorizedException('Kata sandi saat ini salah');
    }

    const hashKataSandiBaru = await bcrypt.hash(ubahKataSandiDto.kataSandiBaru, 10);
    await this.prisma.pengguna.update({
      where: { id: idPengguna },
      data: { hashKataSandi: hashKataSandiBaru },
    });

    return { pesan: 'Kata sandi berhasil diubah' };
  }
}
