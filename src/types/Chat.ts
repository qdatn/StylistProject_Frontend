export interface MessageChat {
  sender: string;
  receiver: string;
  content: string;
  recommendProducts?: ProductRecommend[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRecommend {
  name: string;
  description: string;
  productId: string;
  link: string;
}