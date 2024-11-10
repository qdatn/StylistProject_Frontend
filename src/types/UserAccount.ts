export interface UserAccount {
  user_id: string; // Mã người dùng
  name: string; // Tên người dùng
  phone_number: string; // Số điện thoại người dùng
  gender: 'Male' | 'Female' | 'Secret'; // Giới tính người dùng
  birthday: Date; // Ngày sinh nhật người dùng
  body_shape: string; // Thông tin về body
  height: number; // Chiều cao người dùng
  weight: number; // Cân nặng người dùng
  style_preferences: string[]; // Sở thích về thời trang
  create_date: Date; // Ngày đăng ký tài khoản
  update_date: Date; // Ngày cập nhật thông tin gần nhất
}
