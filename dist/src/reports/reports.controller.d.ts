import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getSalesSummary(dateFrom: string, dateTo: string): Promise<{
        totalTransactions: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        dateFrom: string;
        dateTo: string;
    }>;
    getTopProducts(dateFrom?: string, dateTo?: string, limit?: string): Promise<{
        productId: string;
        productName: string;
        totalQty: number;
        totalRevenue: import("@prisma/client/runtime/library").Decimal;
    }[]>;
}
