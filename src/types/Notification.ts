import { Order } from "./Order";
import { PaginationType } from "./Pagination";
import { UserAccount } from "./UserAccount";

export interface Notification {
  _id: string;
  user: UserAccount[];
  type: string;
  title: string;
  priority: string;
  content: string;
  status: string;
  order?: string | null; // populated nếu cần chi tiết sản phẩm
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface NotificationList {
  data: Notification[];
  pagination: PaginationType;
}