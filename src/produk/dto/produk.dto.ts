import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProdukDto {
  @IsString({ message: 'Kode harus berupa teks' })
  @IsNotEmpty({ message: 'Kode tidak boleh kosong' })
  kode: string;

  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @IsOptional()
  @IsString({ message: 'Kategori harus berupa teks' })
  kategori?: string;

  @IsOptional()
  @IsString({ message: 'Satuan harus berupa teks' })
  satuan?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stok: number;
}

export class UpdateProdukDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa teks' })
  nama?: string;

  @IsOptional()
  @IsString({ message: 'Kategori harus berupa teks' })
  kategori?: string;

  @IsOptional()
  @IsString({ message: 'Satuan harus berupa teks' })
  satuan?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stok?: number;
}

export class UpdateStatusProdukDto {
  @IsOptional()
  aktif?: boolean;
}
