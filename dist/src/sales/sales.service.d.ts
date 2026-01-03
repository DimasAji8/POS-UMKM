import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sale.dto';
import { Role } from '@prisma/client';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSaleDto: CreateSaleDto, cashierId: string): Promise<{
        saleId: string;
        invoiceNo: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paidAmount: import("@prisma/client/runtime/library").Decimal;
        changeAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(userId: string, userRole: Role, page?: number, limit?: number, dateFrom?: string, dateTo?: string, invoiceNo?: string, cashierId?: string): Promise<{
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
    findOne(id: string, userId: string, userRole: Role): Promise<{
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
