import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsDecimal()
  price: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  stock: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal()
  price?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  stock?: number;
}

export class UpdateProductStatusDto {
  @IsOptional()
  isActive?: boolean;
}
