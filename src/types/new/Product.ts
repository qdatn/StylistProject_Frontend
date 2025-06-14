import { PaginationType } from "@src/types/Pagination";
import { Category } from "@src/types/Category";

export interface ProductVariant {
    _id?: string;
    attributes: {
        key: string;
        value: string;
    }[];
    price: number;
    stock_quantity: number;
    min_quantity: number;
    sold_quantity: number | 0;
    stock_update_date?: Date;
}

export interface Product {
    _id: string;
    product_name: string;
    description: string;
    brand: string;
    categories?: Category[]; // Array of category IDs
    status: boolean;
    images: string[];
    variants?: ProductVariant[];
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ProductList {
    data: Product[];
    pagination: PaginationType;
}
export interface ProductWithFiles extends Product {
    imageFiles?: File[];
}