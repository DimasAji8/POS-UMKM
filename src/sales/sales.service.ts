import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sale.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, cashierId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Validate and fetch products
      const productIds = createSaleDto.items.map(item => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products not found or inactive');
      }

      // Check stock and calculate total
      let total = 0;
      const saleItems = [];

      for (const item of createSaleDto.items) {
        const product = products.find(p => p.id === item.productId);
        if (product.stock < item.qty) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
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
        throw new BadRequestException('Paid amount is less than total');
      }

      const changeAmount = createSaleDto.paidAmount - total;

      // Generate invoice number
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

      // Create sale
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

      // Update stock
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

  async findAll(
    userId: string,
    userRole: Role,
    page = 1,
    limit = 10,
    dateFrom?: string,
    dateTo?: string,
    invoiceNo?: string,
    cashierId?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (userRole === Role.CASHIER) {
      where.cashierId = userId;
    } else if (cashierId) {
      where.cashierId = cashierId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
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

  async findOne(id: string, userId: string, userRole: Role) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        cashier: { select: { name: true } },
        saleItems: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (userRole === Role.CASHIER && sale.cashierId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return sale;
  }
}
