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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesSummary(dateFrom, dateTo) {
        const result = await this.prisma.sale.aggregate({
            where: {
                createdAt: {
                    gte: new Date(dateFrom),
                    lte: new Date(dateTo),
                },
            },
            _count: { id: true },
            _sum: { total: true },
        });
        return {
            totalTransactions: result._count.id,
            totalRevenue: result._sum.total || 0,
            dateFrom,
            dateTo,
        };
    }
    async getTopProducts(dateFrom, dateTo, limit = 10) {
        const where = {};
        if (dateFrom || dateTo) {
            where.sale = {
                createdAt: {},
            };
            if (dateFrom)
                where.sale.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.sale.createdAt.lte = new Date(dateTo);
        }
        const topProducts = await this.prisma.saleItem.groupBy({
            by: ['productId', 'productName'],
            where,
            _sum: {
                qty: true,
                subtotal: true,
            },
            orderBy: {
                _sum: {
                    qty: 'desc',
                },
            },
            take: limit,
        });
        return topProducts.map(item => ({
            productId: item.productId,
            productName: item.productName,
            totalQty: item._sum.qty,
            totalRevenue: item._sum.subtotal,
        }));
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map