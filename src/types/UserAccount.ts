import { User } from "./auth/AuthType";
import { PaginationType } from "./Pagination";

export interface UserAccount {
  _id: string; // Mã người dùng
  user: User;
  name: string; // Tên người dùng
  avatar: string; // Avatar người dùng
  phone_number: string; // Số điện thoại người dùng
  gender: "Male" | "Female" | "Other"; // Giới tính người dùng
  birthday: Date; // Ngày sinh nhật người dùng
  body_shape: string; // Thông tin về body
  height: number; // Chiều cao người dùng
  weight: number; // Cân nặng người dùng
  style_preferences?: string[]; // Sở thích về thời trang
  create_date: Date; // Ngày đăng ký tài khoản
  update_date: Date; // Ngày cập nhật thông tin gần nhất
}
export interface CustomerList {
  data: UserAccount[];
  pagination: PaginationType;
}

export const mockUserAccounts: UserAccount[] = [
  {
    _id: "u1",
    user: {
      _id: "auth1",
      email: "alice@example.com",
      password: "hashed_password_1",
      role: "user",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-05"),
    },
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=2",
    phone_number: "0912345678",
    gender: "Female",
    birthday: new Date("1995-06-15"),
    body_shape: "Slim",
    height: 165,
    weight: 52,
    style_preferences: ["Casual", "Elegant"],
    create_date: new Date("2024-01-01"),
    update_date: new Date("2024-01-05"),
  },
  {
    _id: "u2",
    user: {
      _id: "auth2",
      email: "bob@example.com",
      password: "hashed_password_2",
      role: "user",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-10"),
    },
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?img=3",
    phone_number: "0987654321",
    gender: "Male",
    birthday: new Date("1992-12-03"),
    body_shape: "Athletic",
    height: 175,
    weight: 70,
    style_preferences: ["Sporty", "Casual"],
    create_date: new Date("2024-02-01"),
    update_date: new Date("2024-02-10"),
  },
  {
    _id: "u3",
    user: {
      _id: "auth3",
      email: "admin@example.com",
      password: "hashed_password_admin",
      role: "admin",
      createdAt: new Date("2023-12-01"),
      updatedAt: new Date("2024-04-01"),
    },
    name: "Admin",
    avatar: "https://i.pravatar.cc/150?img=5",
    phone_number: "0901122334",
    gender: "Other",
    birthday: new Date("1985-08-20"),
    body_shape: "Average",
    height: 170,
    weight: 65,
    style_preferences: ["Professional", "Minimalist"],
    create_date: new Date("2023-12-01"),
    update_date: new Date("2024-04-01"),
  }
];

export default mockUserAccounts;
