import { IsArray, IsNotEmpty, IsDecimal, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SaleItemDto {
  @ApiProperty({ example: 'clxxx123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateSaleDto {
  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiProperty({ example: 50000 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal()
  paidAmount: number;
}
