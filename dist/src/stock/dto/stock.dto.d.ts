import { AdjustmentType } from '@prisma/client';
export declare class CreateStockAdjustmentDto {
    productId: string;
    type: AdjustmentType;
    qty: number;
    note?: string;
}
