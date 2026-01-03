import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockAdjustmentDto } from './dto/stock.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, AdjustmentType } from '@prisma/client';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StockController {
  constructor(private stockService: StockService) {}

  @Post('adjustments')
  createAdjustment(@Body() createStockAdjustmentDto: CreateStockAdjustmentDto, @Request() req) {
    return this.stockService.createAdjustment(createStockAdjustmentDto, req.user.id);
  }

  @Get('adjustments')
  findAllAdjustments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
    @Query('type') type?: AdjustmentType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.stockService.findAllAdjustments(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      productId,
      type,
      dateFrom,
      dateTo,
    );
  }
}
