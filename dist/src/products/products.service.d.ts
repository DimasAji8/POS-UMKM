import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string, isActive?: boolean, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            category: string | null;
            unit: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        category: string | null;
        unit: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        category: string | null;
        unit: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        category: string | null;
        unit: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    updateStatus(id: string, updateProductStatusDto: UpdateProductStatusDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        category: string | null;
        unit: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
}
