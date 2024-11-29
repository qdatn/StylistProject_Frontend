// app/admin/order/EditOrder.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OrderForm from "@components/OrderForm"; // Import form để chỉnh sửa thông tin đơn hàng
import mockOrders, { Order, OrderTracking } from "@src/types/Order"; // Giả lập dữ liệu đơn hàng
import axiosClient from "@api/axiosClient";
import { notification } from "antd";
import Ordertracking from "@components/OrdertrackingAdmin";
import { OrderItem, OrderItemList } from "@src/types/OrderItem";

const baseUrl = import.meta.env.VITE_API_URL;
const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const orderFromState = location.state?.order || null;
  const [order, setOrder] = useState<Order | null>(orderFromState);
  const [orderItems, setOrderItem] = useState<OrderItem[]>();
  const fetchOrder = async () => {
    try {
      const orderItems = await axiosClient.getOne<OrderItem[]>(`${baseUrl}/api/orderitem/order/${order?._id}`);//+
      if (orderItems) { // Check if orderItems is not null before assigning it to state//+
        setOrderItem(orderItems);
      }
      console.log("tracking orrder: ", orderItems);
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Không thể lấy thông tin đơn hàng!");
    }
  };
  useEffect(() => {
    if (order?._id) {
      fetchOrder(); // Gọi hàm fetchOrder
    }
  }, [order]);
  console.log("dddddddd", orderItems)
  const updateOrderInDB = async (updatedOrder: Order) => {
    try {
      const updateOrder = await axiosClient.put<Order>(
        `${baseUrl}/api/order/${id}`,
        updatedOrder
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateOrder = (updatedOrder: Partial<Order>) => {
    if (order) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedOrderWithId: Order = {
        ...order,
        ...updatedOrder,
        _id: order._id, // Đảm bảo rằng _id không bị mất
      };
      // Cập nhật lại đơn hàng trong state
      setOrder(updatedOrderWithId);
      updateOrderInDB(updatedOrderWithId);

      // Thông báo thành công
      console.log("Updated Order:", updatedOrderWithId);
      notification.success({
        message: "Order updated successfully!",
        description: "You have successfully logged in.",
        placement: "topRight",
        duration: 2,
      });
      navigate("/admin/order"); // Chuyển hướng về danh sách đơn hàng
    }
  };

  const handleCancel = () => {
    navigate("/admin/order"); // Quay lại danh sách đơn hàng nếu hủy
  };
  console.log("dddadfdfkasfh", order)
  console.log("akfwerewer", orderItems)
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Order</h1>
      {order ? (
        <div>
          <div>
            <OrderForm
              initialOrder={order}
              onSave={handleUpdateOrder}
              onCancel={handleCancel}
              type="edit"
            />
          </div>
          <div className="p-5">

            <Ordertracking
              order={order}
              orderitems={orderItems!} />
          </div>
        </div>
      ) : (
        <p>Đang tải dữ liệu đơn hàng...</p>
      )}
    </div>
  );
};

export default EditOrder;

