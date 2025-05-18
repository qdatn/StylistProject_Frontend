export const formatGeminiResponse = (rawContent: string): string => {
  let formatted = rawContent;

  // Xóa tất cả các dấu *
  formatted = formatted.replace(/\*/g, "");

  // Chuyển các dòng tiêu đề (thường là chữ in hoa hoặc bắt đầu dòng) thành in đậm
  formatted = formatted.replace(/^([A-ZÀ-Ỹ][^\n]*:)/gm, "**$1**"); // In đậm nếu bắt đầu bằng chữ hoa và dấu :
  formatted = formatted.replace(/^#\s*(.*)/gm, "**$1**");       // In đậm nếu là heading Markdown

  // Chuyển các dòng danh sách đầu dòng số thành dấu đầu dòng
  formatted = formatted.replace(/^\s*\d+\.\s+/gm, "• ");

  // Xử lý các dòng có dấu - có thể là list hoặc gạch ngang
  formatted = formatted.replace(/^\s*-\s+/gm, "  - "); // Giữ nguyên dấu - và thụt vào nếu ở đầu dòng

  // Loại bỏ các dòng trống thừa (nhiều hơn 2 dòng trống liên tiếp)
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Đảm bảo chỉ có một dòng trống giữa các đoạn văn
  formatted = formatted.replace(/\n{2,}/g, "\n\n");

  return formatted.trim();
};

export default formatGeminiResponse;