export default function getTokenFromCookies(
  cookieName: string = "token"
): string | null {
  const cookies = document.cookie; // Lấy tất cả cookies dưới dạng chuỗi
  const match = cookies.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null; // Trả về giá trị cookie đã decode nếu tìm thấy
}
