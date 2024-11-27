import { Product } from "@src/types/Product";
import { Button, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

interface BasicProductInfoProps {
    product: Partial<Product>;
    setProduct: React.Dispatch<React.SetStateAction<Product>>;
    type: string;
    errors: Record<string, string | null>; // Thêm lỗi từ ProductForm
}

const BasicProductInfo: React.FC<BasicProductInfoProps> = ({ product, setProduct, type, errors }) => {
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
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)
    const handleUploadChange = (info: any) => {
        // const newFileList = [...info.fileList];
        const newFileList = info.fileList.map((file: any) => {
            // Nếu file có sẵn URL thì dùng nó, nếu không thì tạo URL tạm từ file
            // if (!file.url) {
            //   // file.url = URL.createObjectURL(file.originFileObj);

            //   file.url = file.originFileObj;
            // }
            return file;
        });
        console.log(newFileList);
        setFileList(newFileList);
        // Kiểm tra trạng thái upload
        if (info.file.status === "done") {
            message.success(`${info.file.name} uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} upload failed.`);
        }
    };

    useEffect(() => {
        console.log(fileList);
    }, [fileList]);

    // Thêm ảnh từ URL
    const handleAddImageFromUrl = () => {
        if (!newImageUrl.trim()) {
            message.error("Image URL cannot be empty.");
            return;
        }

        // Thêm ảnh vào danh sách
        setFileList((prev) => [
            ...prev,
            {
                uid: Date.now().toString(),
                name: "Custom URL",
                url: newImageUrl,
                status: "done",
            },
        ]);

        setNewImageUrl("");
        setIsUrlModalOpen(false);
        message.success("Image URL added successfully.");
    };

    // Xóa ảnh
    const handleRemoveImage = (file: any) => {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        message.info("Image removed.");
    };


    const [ setErrors] = useState<Record<string, string>>({});
    const today = new Date().toISOString().split("T")[0];
    const createdDate = new Date().toISOString().split("T")[0];

    return (
        <div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                {/* <div>
                    <label className="block font-medium">Product ID</label>
                    <input
                        type="text"
                        name="_id"
                        value={product._id || ""}
                        onChange={handleChange}
                        placeholder="Enter product ID"
                        required
                        disabled
                        className={`w-full mt-1 p-2 border rounded-md ${errors.id ? "border-red-500" : ""
                            }`}
                    />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
                </div> */}
                <div>
                    <label className="block font-medium">Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={product.product_name || ""}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.name ? "border-red-500" : ""
                            }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                    <label className="block font-medium">Original Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price || 0}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="Enter original price"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.originalPrice ? "border-red-500" : ""
                            }`}
                    />
                    {errors.originalPrice && (
                        <p className="text-red-500 text-sm">{errors.originalPrice}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Discounted Price</label>
                    <input
                        type="number"
                        name="discountedPrice"
                        value={product.discountedPrice || product.price}
                        onChange={handleChange}
                        min="0"
                        max={product.price}
                        required
                        placeholder="Enter discounted price"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.discountedPrice ? "border-red-500" : ""
                            }`}
                    />
                    {errors.discountedPrice && (
                        <p className="text-red-500 text-sm">{errors.discountedPrice}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={product.brand || ""}
                        onChange={handleChange}
                        placeholder="Enter brand"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.brand ? "border-red-500" : ""
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
                        visible={isUrlModalOpen}
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
                        <input
                            type="number"
                            name="stock_quantity"
                            value={product.stock_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.stock_quantity ? "border-red-500" : ""
                                }`}
                        />
                        {errors.stock_quantity && (
                            <p className="text-red-500 text-sm">{errors.stock_quantity}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium">Min Quantity</label>
                        <input
                            type="number"
                            name="min_quantity"
                            value={product.min_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.min_quantity ? "border-red-500" : ""
                                }`}
                        />
                        {errors.min_quantity && (
                            <p className="text-red-500 text-sm">{errors.min_quantity}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium">Sold Quantity</label>
                        <input
                            type="number"
                            name="sold_quantity"
                            value={product.sold_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.sold_quantity ? "border-red-500" : ""
                                }`}
                        />
                        {errors.sold_quantity && (
                            <p className="text-red-500 text-sm">{errors.stock_quantity}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block font-medium">Create Date</label>
                        <input
                            type="date"
                            name="createdAt"
                            value={
                                type == "add"
                                    ? today
                                    : product.createdAt
                                        ? new Date(product.createdAt).toISOString().split("T")[0]
                                        : ""
                            } // Giá trị là ngày hiện tại
                            disabled // Không cho phép thay đổi
                            className={`w-full mt-1 p-2 border rounded-md ${errors.createdAt ? "border-red-500" : ""
                                }`}
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
