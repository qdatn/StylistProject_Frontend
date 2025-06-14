export interface MessageChat {
  sender: string;
  receiver: string;
  content: string;
  recommendProducts?: ProductRecommend[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRecommend {
  images: string
  name: string;
  description: string;
  productId: string;
  link: string;
}