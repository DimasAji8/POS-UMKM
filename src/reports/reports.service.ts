import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesSummary(dateFrom: string, dateTo: string) {
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

  async getTopProducts(dateFrom?: string, dateTo?: string, limit = 10) {
    const where: any = {};
    
    if (dateFrom || dateTo) {
      where.sale = {
        createdAt: {},
      };
      if (dateFrom) where.sale.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.sale.createdAt.lte = new Date(dateTo);
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
}
