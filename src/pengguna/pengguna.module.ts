import { Module } from '@nestjs/common';
import { PenggunaService } from './pengguna.service';
import { PenggunaController } from './pengguna.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PenggunaController],
  providers: [PenggunaService],
})
export class PenggunaModule {}
