import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProdukDto {
  @ApiProperty({ example: 'PRD001', description: 'Kode unik produk' })
  @IsString({ message: 'Kode harus berupa teks' })
  @IsNotEmpty({ message: 'Kode tidak boleh kosong' })
  kode: string;

  @ApiProperty({ example: 'Indomie Goreng', description: 'Nama produk' })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @ApiPropertyOptional({ example: 'cat-123', description: 'ID Kategori produk' })
  @IsOptional()
  @IsString({ message: 'ID Kategori harus berupa teks' })
  idKategori?: string;

  @ApiPropertyOptional({ example: 'pcs', description: 'Satuan produk' })
  @IsOptional()
  @IsString({ message: 'Satuan harus berupa teks' })
  satuan?: string;

  @ApiProperty({ example: 3500, description: 'Harga produk' })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga: number;

  @ApiProperty({ example: 100, description: 'Jumlah stok awal' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stok: number;
}

export class UpdateProdukDto {
  @ApiPropertyOptional({ example: 'Indomie Goreng Special' })
  @IsOptional()
  @IsString({ message: 'Nama harus berupa teks' })
  nama?: string;

  @ApiPropertyOptional({ example: 'cat-123' })
  @IsOptional()
  @IsString({ message: 'ID Kategori harus berupa teks' })
  idKategori?: string;

  @ApiPropertyOptional({ example: 'pcs' })
  @IsOptional()
  @IsString({ message: 'Satuan harus berupa teks' })
  satuan?: string;

  @ApiPropertyOptional({ example: 4000 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stok?: number;
}

export class UpdateStatusProdukDto {
  @ApiProperty({ example: true, description: 'Status aktif produk' })
  @IsOptional()
  aktif?: boolean;
}
