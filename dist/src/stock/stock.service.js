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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StockService = class StockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAdjustment(createStockAdjustmentDto, userId) {
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: createStockAdjustmentDto.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            if (createStockAdjustmentDto.type === client_1.AdjustmentType.OUT &&
                product.stock < createStockAdjustmentDto.qty) {
                throw new common_1.BadRequestException('Insufficient stock for OUT adjustment');
            }
            const adjustment = await tx.stockAdjustment.create({
                data: {
                    ...createStockAdjustmentDto,
                    userId,
                },
                include: {
                    product: { select: { name: true, sku: true } },
                    user: { select: { name: true } },
                },
            });
            const stockChange = createStockAdjustmentDto.type === client_1.AdjustmentType.IN
                ? createStockAdjustmentDto.qty
                : -createStockAdjustmentDto.qty;
            await tx.product.update({
                where: { id: createStockAdjustmentDto.productId },
                data: { stock: { increment: stockChange } },
            });
            return adjustment;
        });
    }
    async findAllAdjustments(page = 1, limit = 10, productId, type, dateFrom, dateTo) {
        const skip = (page - 1) * limit;
        const where = {};
        if (productId)
            where.productId = productId;
        if (type)
            where.type = type;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [adjustments, total] = await Promise.all([
            this.prisma.stockAdjustment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    product: { select: { name: true, sku: true } },
                    user: { select: { name: true } },
                },
            }),
            this.prisma.stockAdjustment.count({ where }),
        ]);
        return {
            data: adjustments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map