import { StockService } from './stock.service';
import { CreateStockAdjustmentDto } from './dto/stock.dto';
import { AdjustmentType } from '@prisma/client';
export declare class StockController {
    private stockService;
    constructor(stockService: StockService);
    createAdjustment(createStockAdjustmentDto: CreateStockAdjustmentDto, req: any): Promise<{
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
    findAllAdjustments(page?: string, limit?: string, productId?: string, type?: AdjustmentType, dateFrom?: string, dateTo?: string): Promise<{
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
