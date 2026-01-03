export declare class CreateProductDto {
    sku: string;
    name: string;
    category?: string;
    unit?: string;
    price: number;
    stock: number;
}
export declare class UpdateProductDto {
    name?: string;
    category?: string;
    unit?: string;
    price?: number;
    stock?: number;
}
export declare class UpdateProductStatusDto {
    isActive?: boolean;
}
