import { UserInfo } from "os";
import { Attribute, OrderAttribute } from "./Attribute";
import { User } from "./auth/AuthType";
import { PaginationType } from "./Pagination";
import mockProducts, { Product } from "./Product";
import { UserAccount } from "./UserAccount";
export interface Comment {
  _id?: string;
  product: Product;
  user?: UserAccount | string;
  user_info?: UserAccount;
  rating: number;
  review: string;
  attributes: OrderAttribute[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentList {
  data: Comment[];
  pagination: PaginationType;
}
// const mockComments: Comment[] = [
//   {
//     _id: "1",
//     user: "Alice",
//     review: "Great product! Loved the quality.",
//     rating: 5,
//     attributes: [
//       { key: "Color", value: ["Red"] },
//       { key: "Material", value: ["Cotton"] },
//       { key: "Size", value: ["M"] },
//     ],
//     created_date: "2024-10-01",
//     product: mockProducts[1], // Add the product ID
//   },
//   {
//     _id: "2",
//     user: "Bob",
//     review: "The fit was perfect. Would recommend!",
//     rating: 4,
//     attributes: [
//       { key: "Color", value: ["Blue"] },
//       { key: "Material", value: ["Polyester"] },
//       { key: "Size", value: ["L"] },
//     ],
//     created_date: "2024-10-05",
//     product: mockProducts[2], // Add the product ID
//   },
// ];
// export default mockComments;
