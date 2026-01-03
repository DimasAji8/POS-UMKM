import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSalesSummary(dateFrom: string, dateTo: string): Promise<{
        totalTransactions: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        dateFrom: string;
        dateTo: string;
    }>;
    getTopProducts(dateFrom?: string, dateTo?: string, limit?: number): Promise<{
        productId: string;
        productName: string;
        totalQty: number;
        totalRevenue: import("@prisma/client/runtime/library").Decimal;
    }[]>;
}
