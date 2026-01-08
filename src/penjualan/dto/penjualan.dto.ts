import { IsArray, IsNotEmpty, ValidateNested, IsString, IsInt, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemPenjualanDto {
  @ApiProperty({ example: 'clxxx123' })
  @IsString({ message: 'ID produk harus berupa teks' })
  @IsNotEmpty({ message: 'ID produk tidak boleh kosong' })
  idProduk: string;

  @ApiProperty({ example: 2 })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah: number;
}

export class CreatePenjualanDto {
  @ApiProperty({ type: [ItemPenjualanDto] })
  @IsArray({ message: 'Item harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => ItemPenjualanDto)
  item: ItemPenjualanDto[];

  @ApiProperty({ example: 50000 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Jumlah bayar harus berupa angka' })
  @Min(0, { message: 'Jumlah bayar tidak boleh negatif' })
  jumlahBayar: number;
}
