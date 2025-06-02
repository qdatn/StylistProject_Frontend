import { User } from "./auth/AuthType";
import { PaginationType } from "./Pagination";
import { StylePreference } from "./StylePreferences";

export interface UserAccount {
  _id: string; // Mã người dùng
  user: User;
  name: string; // Tên người dùng
  avatar: string; // Avatar người dùng
  phone_number: string; // Số điện thoại người dùng
  gender: "Male" | "Female" | "Other"; // Giới tính người dùng
  birthday: Date; // Ngày sinh nhật người dùng
  body_shape: string; // Thông tin về body
  style_preferences?: StylePreference; // Sở thích về thời trang
  create_date: Date; // Ngày đăng ký tài khoản
  update_date: Date; // Ngày cập nhật thông tin gần nhất
}
export interface CustomerList {
  data: UserAccount[];
  pagination: PaginationType;
}

