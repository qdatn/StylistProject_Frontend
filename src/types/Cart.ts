// models/Cart.ts

import { Product } from "./Product";


export interface Cart {
    _id: string;
    user: string; // ID của khách hàng
    products: Product[];  // Danh sách sản phẩm trong giỏ hàng
    //createdAt: Date;
    //updateAt: Date; // Tổng giá trị của giỏ hàng
}

// Dữ liệu giả cho giỏ hàng
const mockCart: Cart = {
    _id: 'cart123',
  user: 'user001', // ID khách hàng
  products:[], // Danh sách sản phẩm trong giỏ hàng
  //createdAt: new Date(), // Ngày tạo giỏ hàng
  //updateAt: new Date(), // Ngày cập nhật giỏ hàng
};

export default mockCart;
