import { Module } from '@nestjs/common';
import { StokService } from './stok.service';
import { StokController } from './stok.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StokController],
  providers: [StokService],
})
export class StokModule {}
