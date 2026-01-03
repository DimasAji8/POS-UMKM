export declare class SaleItemDto {
    productId: string;
    qty: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    paidAmount: number;
}
