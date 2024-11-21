// models/Order.ts
import { OrderItem } from './OrderItem';
import mockProducts from './Product';

export interface Order {
  _id: string;
  user: string;
  order_items: OrderItem[];
  status: string;
  discount?: number;
  total_price: number;
  method?: string;
  receive_date?: number;
  create_date?: Date;
  update_date?: Date;
}

const calculateTotalPrice = (orderItems: OrderItem[], discount?: number): number => {
  const subtotal = orderItems.reduce((total, item) => {
    return total + item.product.discountedPrice * item.orderitem_quantity;
  }, 0);
  return discount ? subtotal * ((100 - discount) / 100) : subtotal;
};
const mockOrderItem: OrderItem[] = [
  {
    product: mockProducts[0],
    orderitem_quantity: 2,
    attributes: [
      { key: 'Color', value: 'Blue' },
      { key: 'Size', value: 'M' }
    ]
  },
  {
    product: mockProducts[0],
    orderitem_quantity: 2,
    attributes: [
      { key: 'Color', value: 'Blue' },
      { key: 'Size', value: 'XL' }
    ]
  },
  {
    product: mockProducts[1],
    orderitem_quantity: 2,
    attributes: [
      { key: 'Color', value: 'Blue' },
      { key: 'Size', value: 'M' }
    ]
  },

];
const mockOrders: Order[] = [
  {
    _id: 'order3',
    user: 'user789',
    order_items: [mockOrderItem[1]],
    status: 'delivered',
    discount: 10,
    total_price: calculateTotalPrice([mockOrderItem[0], mockOrderItem[2]], 10),
    method: 'Credit card',
    receive_date: new Date().getTime(),
    create_date: new Date(),
    update_date: new Date()
  },
  {
    _id: 'order4',
    user: 'user789',
    order_items: [mockOrderItem[1], mockOrderItem[2]],
    status: 'delivered',
    discount: 10,
    total_price: calculateTotalPrice([mockOrderItem[1]], 5),
    method: 'Credit card',
    receive_date: new Date().getTime(),
    create_date: new Date(),
    update_date: new Date()
  },

];

// Tạo danh sách các `Order`, mỗi `Order` bao gồm nhiều `OrderItem`


export default mockOrders;
