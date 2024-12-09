import { User } from "./auth/AuthType";

export interface Address {
  _id?: string;
  user: User | string;
  name: string;
  phone_num: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
