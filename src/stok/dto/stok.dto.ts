import { IsString, IsNotEmpty, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipePenyesuaian } from '@prisma/client';

export class CreatePenyesuaianStokDto {
  @IsString({ message: 'ID produk harus berupa teks' })
  @IsNotEmpty({ message: 'ID produk tidak boleh kosong' })
  idProduk: string;

  @IsEnum(TipePenyesuaian, { message: 'Tipe harus MASUK atau KELUAR' })
  tipe: TipePenyesuaian;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah: number;

  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks' })
  catatan?: string;
}
