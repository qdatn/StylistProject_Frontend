import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy tham số trả về từ MoMo
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("orderId");

    if (status === "1") {
      // Nếu thanh toán thành công, điều hướng đến trang chủ hoặc trang khác
      alert("Thanh toán thành công!");
      navigate("/"); // Điều hướng tới trang home hoặc trang bạn muốn
    } else {
      // Nếu thanh toán thất bại
      alert("Thanh toán thất bại. Vui lòng thử lại.");
      navigate("/cart"); // Điều hướng đến trang retry hoặc trang khác
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center">
      <h1>Đang xử lý thanh toán...</h1>
    </div>
  );
};

export default PaymentSuccessPage;
