// app/admin/order/EditOrder.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderForm from "@components/OrderForm"; // Import form để chỉnh sửa thông tin đơn hàng
import mockOrders, { Order } from "@src/types/Order"; // Giả lập dữ liệu đơn hàng

const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Tìm đơn hàng theo ID trong mockOrders
    const existingOrder = mockOrders.find((ord) => ord._id === id);
    if (existingOrder) {
      setOrder(existingOrder);
    } else {
      alert("Không tìm thấy đơn hàng.");
      navigate("/admin/order"); // Quay lại danh sách nếu không tìm thấy đơn hàng
    }
  }, [id, navigate]);

  const handleUpdateOrder = (updatedOrder: Partial<Order>) => {
    if (order) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedOrderWithId: Order = {
        ...order,
        ...updatedOrder,
        _id: order._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật danh mục trong mockOrders
      const index = mockOrders.findIndex((ord) => ord._id === order._id);
      if (index !== -1) {
        mockOrders[index] = { ...mockOrders[index], ...updatedOrder };
      }

      // Cập nhật lại đơn hàng trong state
      setOrder(updatedOrderWithId);

      // Thông báo thành công
      console.log("Updated Order:", updatedOrderWithId);
      alert("Order updated successfully!");
      navigate("/admin/order"); // Chuyển hướng về danh sách đơn hàng
    }
  };

  const handleCancel = () => {
    navigate("/admin/order"); // Quay lại danh sách đơn hàng nếu hủy
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Order</h1>
      {order ? (
        <OrderForm
          initialOrder={order}
          onSave={handleUpdateOrder}
          onCancel={handleCancel}
        />
      ) : (
        <p>Đang tải dữ liệu đơn hàng...</p>
      )}
    </div>
  );
};

export default EditOrder;
