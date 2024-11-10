// models/Order.ts
import { OrderItem } from './OrderItem';

export interface Order {
  order_id: string;
  user_id: string;
  order_items: OrderItem[];
  status: string;
  discount?: string;
  total_price: number;
  method?: string;
  receive_date?: number;
  create_date: Date;
  update_date?: Date;
}
const mockOrders: Order[] = [
  {
    order_id: "64b123a5f0f6d4e123456789",
    user_id: "64b123a5f0f6d4e123456780",
    order_items: [
      {
        product_id: "64b123a5f0f6d4e123456781",
        product_name: "Wrap bodice balloon sleeve midi dress",
        orderitem_quantity: 2,
        note: "Gói quà",
        purchased_price: 40.00,
        discounted_price: 36.00,
        attributes: [
          { key: "Color", value: "Blue" },
          { key: "Size", value: "XL" }
        ],
        imageUrl: "/path/to/image.jpg"
      }
    ],
    status: "delivered",
    discount: "SUMMER20",
    total_price: 72.00,
    method: "Credit Card",
    receive_date: 1698979200,
    create_date: new Date("2024-10-01T10:00:00Z"),
    update_date: new Date("2024-10-10T15:00:00Z")
  }
];

export default mockOrders;