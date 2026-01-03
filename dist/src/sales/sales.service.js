"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSaleDto, cashierId) {
        return this.prisma.$transaction(async (tx) => {
            const productIds = createSaleDto.items.map(item => item.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds }, isActive: true },
            });
            if (products.length !== productIds.length) {
                throw new common_1.BadRequestException('Some products not found or inactive');
            }
            let total = 0;
            const saleItems = [];
            for (const item of createSaleDto.items) {
                const product = products.find(p => p.id === item.productId);
                if (product.stock < item.qty) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
                }
                const subtotal = product.price.toNumber() * item.qty;
                total += subtotal;
                saleItems.push({
                    productId: item.productId,
                    sku: product.sku,
                    productName: product.name,
                    qty: item.qty,
                    price: product.price,
                    subtotal,
                });
            }
            if (createSaleDto.paidAmount < total) {
                throw new common_1.BadRequestException('Paid amount is less than total');
            }
            const changeAmount = createSaleDto.paidAmount - total;
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const lastSale = await tx.sale.findFirst({
                where: { invoiceNo: { startsWith: `INV-${dateStr}` } },
                orderBy: { invoiceNo: 'desc' },
            });
            let sequence = 1;
            if (lastSale) {
                const lastSequence = parseInt(lastSale.invoiceNo.split('-')[2]);
                sequence = lastSequence + 1;
            }
            const invoiceNo = `INV-${dateStr}-${sequence.toString().padStart(4, '0')}`;
            const sale = await tx.sale.create({
                data: {
                    invoiceNo,
                    cashierId,
                    total,
                    paidAmount: createSaleDto.paidAmount,
                    changeAmount,
                    saleItems: {
                        create: saleItems,
                    },
                },
                include: { saleItems: true },
            });
            for (const item of createSaleDto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.qty } },
                });
            }
            return {
                saleId: sale.id,
                invoiceNo: sale.invoiceNo,
                total: sale.total,
                paidAmount: sale.paidAmount,
                changeAmount: sale.changeAmount,
            };
        });
    }
    async findAll(userId, userRole, page = 1, limit = 10, dateFrom, dateTo, invoiceNo, cashierId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole === client_1.Role.CASHIER) {
            where.cashierId = userId;
        }
        else if (cashierId) {
            where.cashierId = cashierId;
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        if (invoiceNo) {
            where.invoiceNo = { contains: invoiceNo };
        }
        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    cashier: { select: { name: true } },
                    saleItems: true,
                },
            }),
            this.prisma.sale.count({ where }),
        ]);
        return {
            data: sales,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId, userRole) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                cashier: { select: { name: true } },
                saleItems: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        if (userRole === client_1.Role.CASHIER && sale.cashierId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return sale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map