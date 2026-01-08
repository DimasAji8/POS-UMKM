import { IsString, IsNotEmpty, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipePenyesuaian } from '@prisma/client';

export class CreatePenyesuaianStokDto {
  @ApiProperty({ example: 'clxxx123', description: 'ID produk' })
  @IsString({ message: 'ID produk harus berupa teks' })
  @IsNotEmpty({ message: 'ID produk tidak boleh kosong' })
  idProduk: string;

  @ApiProperty({ enum: TipePenyesuaian, example: 'MASUK', description: 'Tipe penyesuaian: MASUK atau KELUAR' })
  @IsEnum(TipePenyesuaian, { message: 'Tipe harus MASUK atau KELUAR' })
  tipe: TipePenyesuaian;

  @ApiProperty({ example: 10, description: 'Jumlah stok yang disesuaikan' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah: number;

  @ApiPropertyOptional({ example: 'Restok dari supplier', description: 'Catatan penyesuaian' })
  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks' })
  catatan?: string;
}
