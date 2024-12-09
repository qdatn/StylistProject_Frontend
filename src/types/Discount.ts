import { PaginationType } from "./Pagination";

export interface Discount {
    _id: string; // Mã ID duy nhất của mã giảm giá
    code: string; // Mã code giảm giá
    type: string; // Loại giảm giá (ví dụ: "product", "category", v.v.)
    value: number; // Giá trị giảm giá (có thể là số tiền hoặc phần trăm)
    minimum_value?: number; // Giá trị tối thiểu để áp dụng giảm giá
    max_discount?: number; // Mức giảm tối đa
    apply_items: string[]; // Danh sách các mặt hàng hoặc danh mục áp dụng
    start_date: Date; // Ngày bắt đầu áp dụng
    end_date: Date; // Ngày kết thúc áp dụng
    usage_limit?: number; // Giới hạn số lần sử dụng
    used_count?: number; // Số lần đã sử dụng
    status: boolean; // Trạng thái của mã giảm giá (true: hoạt động, false: không hoạt động)
}
export interface DiscountList {
    data: Discount[];
    pagination: PaginationType;
  }

const mockDiscounts: Discount[] = [
    {
        _id: "1",
        code: "SUMMER2024",
        type: "product",
        value: 20,
        minimum_value: 100,
        max_discount: 150,
        apply_items: ["1", "2"], // Danh sách ID các sản phẩm áp dụng
        start_date: new Date('2024-10-31'),
        end_date: new Date('2024-10-31'),
        usage_limit: 100,
        used_count: 20,
        status: true,
    },
    {
        _id: "1",
        code: "WINTER2024",
        type: "category",
        value: 15,
        minimum_value: 150,
        max_discount: 200,
        apply_items: ["1", "2"], // Danh sách ID các danh mục áp dụng
        start_date: new Date('2024-10-31'),
        end_date: new Date('2024-10-31'),
        usage_limit: 50,
        used_count: 10,
        status: true,
    },
];

export default mockDiscounts;
