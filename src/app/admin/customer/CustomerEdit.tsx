import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CustomerForm from "@components/CustomerForm";
import { UserAccount } from "@src/types/UserAccount";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;
const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const customerFromState = location.state?.customer || null;

  const [customer, setCustomer] = useState<UserAccount | null>(customerFromState);

  const updateCustomerInDB = async (updatedCustomer: UserAccount) => {
    try {
      const updateCustomer = await axiosClient.put<UserAccount>(
        `${baseUrl}/api/userinfo/${id}`,
        updatedCustomer
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateCustomer = (updatedCustomer: Partial<UserAccount>) => {
    if (customer) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedCustomerWithId: UserAccount = {
        ...customer,
        ...updatedCustomer,
        _id: customer._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật lại danh mục trong state
      setCustomer(updatedCustomerWithId);
      updateCustomerInDB(updatedCustomerWithId);
      // Thông báo thành công
      console.log("Updated Customer:", updatedCustomerWithId);
      notification.success({
        message: "Customer updated successfully!",
        description: "",
        placement: "topRight",
        duration: 2,
      });

      // Chuyển hướng về trang danh sách danh mục
      navigate("/admin/customer/list");
    }
  };

  const handleCancel = () => {
    navigate("/admin/customer/list"); // Quay lại danh sách danh mục
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="font-semibold text-xl p-6">Customer Information</h1> */}
      {customer ? (
        <CustomerForm
          initialCustomer={customer}
          onSave={handleUpdateCustomer}
          onCancel={handleCancel}
          type="edit"
        />
      ) : (
        <p>Loading customer...</p>
      )}
    </div>
  );
};

export default EditCustomer;
