import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sale.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Create new sale transaction' })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    return this.salesService.create(createSaleDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'invoiceNo', required: false })
  @ApiQuery({ name: 'cashierId', required: false })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('invoiceNo') invoiceNo?: string,
    @Query('cashierId') cashierId?: string,
  ) {
    return this.salesService.findAll(
      req.user.id,
      req.user.role,
      parseInt(page) || 1,
      parseInt(limit) || 10,
      dateFrom,
      dateTo,
      invoiceNo,
      cashierId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.salesService.findOne(id, req.user.id, req.user.role);
  }
}
