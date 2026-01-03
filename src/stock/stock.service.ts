import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockAdjustmentDto } from './dto/stock.dto';
import { AdjustmentType } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async createAdjustment(createStockAdjustmentDto: CreateStockAdjustmentDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: createStockAdjustmentDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (createStockAdjustmentDto.type === AdjustmentType.OUT && 
          product.stock < createStockAdjustmentDto.qty) {
        throw new BadRequestException('Insufficient stock for OUT adjustment');
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

      const stockChange = createStockAdjustmentDto.type === AdjustmentType.IN 
        ? createStockAdjustmentDto.qty 
        : -createStockAdjustmentDto.qty;

      await tx.product.update({
        where: { id: createStockAdjustmentDto.productId },
        data: { stock: { increment: stockChange } },
      });

      return adjustment;
    });
  }

  async findAllAdjustments(
    page = 1,
    limit = 10,
    productId?: string,
    type?: AdjustmentType,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (productId) where.productId = productId;
    if (type) where.type = type;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
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
}
