import { IsString, IsNotEmpty, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { AdjustmentType } from '@prisma/client';

export class CreateStockAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsEnum(AdjustmentType)
  type: AdjustmentType;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  note?: string;
}
