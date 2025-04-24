import { PaginationType } from "./Pagination";

export interface Customer {
    _id: string;
    category_name: string;
    description?: string;
}
export interface CustomerList {
    data: Customer[];
    pagination: PaginationType;
}
