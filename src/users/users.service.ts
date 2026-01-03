import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserStatusDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async updateStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserStatusDto,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
      },
    });
  }

  async resetPassword(id: string) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
  }
}
