import { Product } from "@src/types/Product";
import { Button, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { formatCurrency } from "@utils/format";
import { DatePicker } from "antd";
import moment from "moment";
import axiosClient from "@api/axiosClient";
import axios from "axios";

interface BasicProductInfoProps {
  product: Partial<Product>;
  setProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  type: string;
  errors: Record<string, string | null>; // Thêm lỗi từ ProductForm
}

const baseUrl = import.meta.env.VITE_API_URL;

const BasicProductInfo: React.FC<BasicProductInfoProps> = ({
  product,
  setProduct,
  type,
  errors,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  const [fileList, setFileList] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Sử dụng useEffect để cập nhật fileList từ dữ liệu sản phẩm khi load
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const initialFileList = product.images.map((url, index) => ({
        uid: index.toString(),
        name: `image-${index + 1}`,
        status: "done",
        url: url, // Đảm bảo rằng bạn lưu trữ đường dẫn ảnh hợp lệ
      }));
      setFileList(initialFileList);
    }
  }, [product.images]);

  const handleUploadChange = async (info: any) => {
    const newFileList = await Promise.all(
      info.fileList.map(async (file: any) => {
        if (!file.url && file.originFileObj) {
          console.log(file.originFileObj);
          const formData = new FormData();
          formData.append("image", file.originFileObj);

          try {
            // Đợi kết quả trả về từ API
            const result: any = await axios.post(
              `${baseUrl}/api/product/upload/${product._id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Important for file uploads
                },
              }
            );

            console.log("LINK",result);
            if (result && result.data.imageUrl) {
              // Tạo URL tạm thời nếu chưa có
              file.url = result.data.imageUrl;
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            return file; // Trả lại file gốc nếu có lỗi
          }
        }
        return file; // Nếu không có originFileObj, trả lại file gốc
      })
    );

    // const newFileList = info.fileList.map((file: any) => {
    //   if (!file.url && file.originFileObj) {
    //     // Tạo URL tạm thời để hiển thị ảnh
    //     file.url = URL.createObjectURL(file.originFileObj);
    //   }
    //   return file;
    // });
    setFileList(newFileList);
    console.log(newFileList);
    // Cập nhật ảnh vào dữ liệu sản phẩm
    const newImageUrls = newFileList
      .map((file: any) => file.url)
      .filter(Boolean); // Lọc các URL không hợp lệ
    setProduct((prev) => ({
      ...prev,
      images: newImageUrls, // Lưu danh sách ảnh vào product
    }));

    // Kiểm tra trạng thái upload
    if (info.file.status === "done") {
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  useEffect(() => {
    console.log("FILE LIST", fileList);
  }, [fileList]);

  const handleAddImageFromUrl = () => {
    if (!newImageUrl.trim()) {
      message.error("Image URL cannot be empty.");
      return;
    }

    // Thêm ảnh URL vào danh sách ảnh
    setFileList((prev) => [
      ...prev,
      {
        uid: Date.now().toString(),
        name: "Custom URL",
        url: newImageUrl,
        status: "done",
      },
    ]);

    // Cập nhật ảnh vào sản phẩm
    setProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl],
    }));

    setNewImageUrl("");
    setIsUrlModalOpen(false);
    message.success("Image URL added successfully.");
  };
  const handleRemoveImage = (file: any) => {
    // setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setFileList((prev) => prev.filter(async (item) => {
        console.log("DELETE ITEM:",file); // Xem chi tiết các thuộc tính của item
        if(item.uid !== file.uid){
            const result = await axiosClient.post(`${baseUrl}/api/product/delete-img/${product._id}`,{
                imageUrl: file.url
            })
        }
        return item.uid !== file.uid;
      }));
    message.info("Image removed.");
  };
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setProduct((prev) => ({
        ...prev,
        createdAt: date.toDate(),
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        createdAt: undefined, // Xóa ngày nếu không chọn
      }));
    }
  };

  const [setErrors] = useState<Record<string, string>>({});
  const today = new Date().toISOString().split("T")[0];
  const createdDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
        <div>
          <label className="block font-medium">Product ID</label>
          <Input
            type="text"
            name="_id"
            value={product._id || ""}
            onChange={handleChange}
            placeholder="Enter product ID"
            required
            disabled
            className={`w-full mt-1 p-2 border rounded-md ${
              errors.id ? "border-red-500" : ""
            }`}
          />
          {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
        </div>
        <div>
          <label className="block font-medium">Product Name</label>
          <Input
            type="text"
            name="product_name"
            value={product.product_name || ""}
            onChange={handleChange}
            placeholder="Enter product name"
            className={`w-full mt-1 p-2 border rounded-md ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <div className="flex flex-grow gap-3">
            <label className="block font-medium">Original Price:</label>
            <p className="pr-1 pl-1 text-blue-600 rounded-sm border border-blue-200 bg-blue-50">
              {formatCurrency(product.price || 0)}
            </p>
          </div>
          <Input
            type="number"
            name="price"
            value={product.price || 0}
            onChange={handleChange}
            min="0"
            required
            placeholder="Enter original price"
            className={`w-full mt-1 p-2 border rounded-md ${
              errors.originalPrice ? "border-red-500" : ""
            }`}
          />
          {errors.originalPrice && (
            <p className="text-red-500 text-sm">{errors.originalPrice}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Discounted Price</label>
          <Input
            type="number"
            name="discounted_price"
            value={product.discounted_price || product.price}
            onChange={(e) => {
              const value = e.target.value;
              const discountedValue =
                value === "" ? product.price : parseFloat(value);

              if (discountedValue && discountedValue <= (product.price || 0)) {
                setProduct((prev) => ({
                  ...prev,
                  discounted_price: discountedValue,
                }));
              } else if (value !== "") {
                message.error(
                  "Discounted price cannot be greater than original price."
                );
              }
            }}
            min="0"
            max={product.price}
            required
            placeholder="Enter discounted price"
            className={`w-full mt-1 p-2 border rounded-md ${
              errors.discounted_price ? "border-red-500" : ""
            }`}
          />
          {errors.discounted_price && (
            <p className="text-red-500 text-sm">{errors.discounted_price}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Brand</label>
          <Input
            type="text"
            name="brand"
            value={product.brand || ""}
            onChange={handleChange}
            placeholder="Enter brand"
            required
            className={`w-full mt-1 p-2 border rounded-md ${
              errors.brand ? "border-red-500" : ""
            }`}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm">{errors.brand}</p>
          )}
        </div>
      </div>

      <div>
        <div className="justify-center mt-2 pt-2 space-y-4">
          <label className="block font-medium">Product Images</label>

          {/* Upload nhiều ảnh */}
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            onRemove={handleRemoveImage}
            beforeUpload={() => false} // Không upload ngay mà chỉ hiển thị
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>

          {/* Thêm ảnh từ URL */}
          <Button
            type="dashed"
            onClick={() => setIsUrlModalOpen(true)}
            className="mt-3"
            block
          >
            Add Image by URL
          </Button>

          {/* Modal thêm ảnh từ URL */}
          <Modal
            title="Add Image by URL"
            open={isUrlModalOpen}
            onOk={handleAddImageFromUrl}
            onCancel={() => setIsUrlModalOpen(false)}
          >
            <Input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-2 border rounded"
            />
          </Modal>
        </div>

        <div className=" justify-center mt-4 ">
          <label className=" block font-medium">Decription</label>
          <textarea
            className="w-full mt-1 p-3 border rounded"
            name="description"
            value={product.description || ""}
            onChange={handleChange} // Thêm sự kiện onChange
            placeholder="Write description."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-row ">
        <div className="w-1/2 justify-center pr-6">
          <div>
            <label className="block font-medium">Stock Quantity</label>
            <Input
              type="number"
              name="stock_quantity"
              value={product.stock_quantity || 0}
              onChange={handleChange}
              min="0"
              required
              placeholder="Enter stock quantity"
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.stock_quantity ? "border-red-500" : ""
              }`}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm">{errors.stock_quantity}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Min Quantity</label>
            <Input
              type="number"
              name="min_quantity"
              value={product.min_quantity || 0}
              onChange={handleChange}
              min="0"
              placeholder="Enter stock quantity"
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.min_quantity ? "border-red-500" : ""
              }`}
            />
            {errors.min_quantity && (
              <p className="text-red-500 text-sm">{errors.min_quantity}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Sold Quantity</label>
            <Input
              type="number"
              name="sold_quantity"
              value={product.sold_quantity || 0}
              onChange={handleChange}
              min="0"
              placeholder="Enter stock quantity"
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.sold_quantity ? "border-red-500" : ""
              }`}
            />
            {errors.sold_quantity && (
              <p className="text-red-500 text-sm">{errors.stock_quantity}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Created At</label>
            <DatePicker
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.createdAt ? "border-red-500" : ""
              }`}
              value={product.createdAt ? moment(product.createdAt) : null} // Hiển thị giá trị ngày
              onChange={handleDateChange}
              format="DD-MM-YYYY" // Định dạng ngày
              placeholder="Select created date"
              disabled
            />
            {errors.createdAt && (
              <p className="text-red-500 text-sm">{errors.createdAt}</p>
            )}
          </div>
        </div>
      </div>
      {/* Các trường khác... */}
    </div>
  );
};

export default BasicProductInfo;
