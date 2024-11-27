// src/types/OrderItem.ts
import { Product } from "@src/types/Product";
import { OrderAttribute } from "./Attribute";

export interface OrderItem {
  _id: string;
  order?: string;
  product: Product;
  //product_name: string;
  quantity: number;
  note?: string;
  //purchased_price: number;
  //discounted_price: number;
  attributes: OrderAttribute[];
  //image: string[];
}
// Đã sửa kiểu dữ liệu imageURL -> image
// Hàm để lấy dữ liệu sản phẩm theo product_id
// export function createOrderItem(
//     product_id: string,
//     orderitem_quantity: number,
//     attributes: { key: string; value: string }[],
//     note?: string
// ): OrderItem | null {
//     const product = mockProducts.find((p) => p.id === product_id);

//     if (!product) {
//         console.error(`Product with id ${product_id} not found.`);
//         return null;
//     }

//     return {
//         product_id: product.id,
//         product_name: product.name,
//         orderitem_quantity,
//         note,
//         purchased_price: product.originalPrice,
//         discounted_price: product.discountedPrice,
//         attributes,
//         image: product.image ? [...product.image] : [],
//     };
// }
