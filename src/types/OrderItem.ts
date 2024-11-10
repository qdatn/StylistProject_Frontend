// models/OrderItem.ts
export interface OrderItem {
    product_id: string;
    product_name: string;
    orderitem_quantity: number;
    note?: string;
    purchased_price: number;
    discounted_price: number;
    attributes: { key: string; value: string }[];
    imageUrl: string;
  }