import { PrismaService } from '../prisma/prisma.service';
import { CreateStockAdjustmentDto } from './dto/stock.dto';
import { AdjustmentType } from '@prisma/client';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    createAdjustment(createStockAdjustmentDto: CreateStockAdjustmentDto, userId: string): Promise<{
        user: {
            name: string;
        };
        product: {
            name: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AdjustmentType;
        productId: string;
        qty: number;
        note: string | null;
        userId: string;
    }>;
    findAllAdjustments(page?: number, limit?: number, productId?: string, type?: AdjustmentType, dateFrom?: string, dateTo?: string): Promise<{
        data: ({
            user: {
                name: string;
            };
            product: {
                name: string;
                sku: string;
            };
        } & {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.AdjustmentType;
            productId: string;
            qty: number;
            note: string | null;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
