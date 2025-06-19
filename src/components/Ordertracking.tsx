// components/Ordertracking.tsx
import React, { useState } from "react";
import OrderItemPage from "@components/OrderItem";
import { Order, OrderTracking } from "@src/types/Order";
import OrderReviewForm from "./OrderReview";
import { OrderItem } from "@src/types/OrderItem";
import { formatCurrency } from "@utils/format";
import OrderDetailModal from "./OrderDetailModal";
import { Popconfirm } from "antd";
import axiosClient from "@api/axiosClient";
import { OrderAttribute } from "@src/types/Attribute";
import { Product, ProductVariant } from "@src/types/new/Product";
import { motion } from "framer-motion";
import moment from "moment";

interface OrdertrackingProps {
  order: Order;
  orderitems: OrderItem[];
}

const Ordertracking: React.FC<OrdertrackingProps> = ({ order, orderitems }) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const findMatchingVariant = (
    variants: ProductVariant[],
    attributes: OrderAttribute[]
  ) => {
    return variants.find((variant: ProductVariant) => {
      return (
        attributes.every((attr) =>
          variant.attributes.some(
            (vAttr: any) => vAttr.key === attr.key && vAttr.value === attr.value
          )
        ) && variant.attributes.length === attributes.length
      );
    });
  };

  const CancelOrder = async (order: Order) => {
    const orderId = order._id;

    // 1. Lấy danh sách order_items từ order
    const order_items: OrderItem[] = await axiosClient.getOne(
      `${apiUrl}/api/orderitem/order/${orderId}`
    );

    if (order.method == "COD") {
      for (const item of order_items) {
        const product = item.product;
        const attributes = item.attributes;

        // 2. Tìm variant tương ứng với attributes
        const matchedVariant = findMatchingVariant(
          product.variants!,
          attributes
        );

        console.log(matchedVariant);
        if (!matchedVariant) {
          console.warn("Not found suitable variants", attributes);
          continue;
        }

        // 3. Cập nhật stock_quantity: + thêm lại số lượng đã mua
        // const updatedStock = matchedVariant.stock_quantity + item.quantity;
        const updatedStock = item.quantity;

        const updatedVariants = product.variants!.map((variant) => {
          const isMatch = variant.attributes.every((attr) => {
            return attributes.some(
              (tAttr) => tAttr.key === attr.key && tAttr.value === attr.value
            );
          });

          if (isMatch) {
            return {
              ...variant,
              stock_quantity: variant.stock_quantity + updatedStock,
              sold_quantity: variant.sold_quantity - updatedStock,
              stock_update_date: new Date().toISOString(),
            };
          }

          return variant;
        });

        // 4. Gửi API cập nhật variant
        await axiosClient.put<Product>(`${apiUrl}/api/product/${product._id}`, {
          ...product,
          variants: updatedVariants,
        });
      }

      // 5. Cập nhật trạng thái đơn hàng là "cancelled"
      await axiosClient.put(`${apiUrl}/api/order/${orderId}`, {
        status: "cancelled",
      });

      // Reload lại trang
      window.location.reload();
    } else {
      // 5. Cập nhật trạng thái đơn hàng là "cancelled"
      await axiosClient.put(`${apiUrl}/api/order/${orderId}`, {
        status: "pending",
      });

      // Reload lại trang
      window.location.reload();
    }
  };

  const ContinuePayment = async (order: Order) => {
    const orderId = order._id;
    localStorage.setItem("momo_order_id", order._id);

    if (orderId) {
      const rawOrderData: any = localStorage.getItem(orderId);

      if (rawOrderData) {
        const orderData = JSON.parse(rawOrderData);

        const paymentBody = orderData.paymentBody;

        if (paymentBody) {
          try {
            // Make the POST request to the MoMo API
            const response: any = await axiosClient.post(
              `${apiUrl}/api/payment/momo`,
              paymentBody
            );
            console.log("momo:", response);

            if (response && response.payUrl) {
              window.location.href = response.payUrl; // Navigate to the payment page
              // localStorage.setItem("momo_order_id", createOrder.order._id);
            } else {
              console.error("Failed to retrieve payUrl from response");
            }
          } catch (error) {
            console.error("Error during payment request:", error);
          }
        }
      }
    }
  };

  const isExpired = (order: Order) => {
    return moment().diff(moment(order.createdAt), "hours") >= 12;
  };

  const paymentDataExist = (order: Order) => {
    const orderId = order._id;

    const rawOrderData: any = localStorage.getItem(orderId);
    if (rawOrderData) return true;

    return false;
  };

  return (
    // <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
    <motion.div
      className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Trạng thái đơn hàng */}
      <div className="order-status mb-4 flex justify-end items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-600">
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-items mb-4">
        {orderitems &&
          orderitems.map((item) => (
            <OrderItemPage key={item._id} item={item} />
          ))}
      </div>

      {/* Tổng tiền - căn phải */}
      <div className="order-total flex justify-end pt-4">
        <span className="text-base font-normal mr-2">Discount:</span>
        <span className="text-base font-bold text-gray-700">
          - {formatCurrency(order?.discount)}
        </span>
      </div>
      <div className="order-total flex justify-end pt-4">
        <span className="text-lg font-medium mr-2">Total:</span>
        <span className="text-lg font-semibold text-gray-700">
          {formatCurrency(order.total_price)}
        </span>
      </div>

      {/* Nút hành động */}
      <div className="order-actions mt-4 flex justify-end gap-4">
        {order.status === "shipped" && (
          <button
            className="bg-gray-300 px-10 py-2 rounded font-semibold"
            onClick={() => setIsReviewFormOpen(true)}
          >
            Review
          </button>
        )}

        {(order.status === "in progress" ||
          order.status === "Waiting for payment!") && (
          <Popconfirm
            title="Are you sure to cancel this order?"
            description="This action cannot be undone."
            onConfirm={() => {
              CancelOrder(order);
              console.log(order._id);
            }}
            okText="Yes"
            cancelText="No"
            placement="topLeft"
          >
            <button className="bg-gray-400 text-white px-6 py-2 rounded font-semibold hover:bg-red-600">
              Cancel Order
            </button>
          </Popconfirm>
        )}

        {order.status === "Waiting for payment!" &&
          !isExpired(order) &&
          paymentDataExist(order) && (
            <button
              className="bg-yellow-500 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-600"
              onClick={() => {
                // TODO: gọi API hoàn tiền
                ContinuePayment(order);
                console.log("Continue payment:", order._id);
              }}
            >
              Continue Payment
            </button>
          )}

        <button
          className="bg-gray-800 text-white px-10 py-2 rounded font-semibold"
          onClick={() => setIsDetailModalOpen(true)}
        >
          Detail
        </button>
      </div>

      {/* Modal Overlay for Review Form */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OrderReviewForm
            order={order}
            orderitems={orderitems}
            onClose={() => setIsReviewFormOpen(false)}
          />
        </div>
      )}
      {/* Modal Chi Tiết Đơn Hàng */}
      {isDetailModalOpen && (
        <OrderDetailModal
          order={order}
          orderitems={orderitems}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default Ordertracking;
