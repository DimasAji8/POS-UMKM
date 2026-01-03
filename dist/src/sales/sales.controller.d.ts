import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sale.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, req: any): Promise<{
        saleId: string;
        invoiceNo: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paidAmount: import("@prisma/client/runtime/library").Decimal;
        changeAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(req: any, page?: string, limit?: string, dateFrom?: string, dateTo?: string, invoiceNo?: string, cashierId?: string): Promise<{
        data: ({
            saleItems: {
                id: string;
                sku: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                qty: number;
                saleId: string;
                productName: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            cashier: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            invoiceNo: string;
            changeAmount: import("@prisma/client/runtime/library").Decimal;
            cashierId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, req: any): Promise<{
        saleItems: {
            id: string;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            qty: number;
            saleId: string;
            productName: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        cashier: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        paidAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceNo: string;
        changeAmount: import("@prisma/client/runtime/library").Decimal;
        cashierId: string;
    }>;
}
