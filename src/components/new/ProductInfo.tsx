import React, { useEffect, useRef, useState } from "react";
import { Category } from "@src/types/Category";
import { Product } from "@src/types/new/Product";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type {
  UploadFile,
  UploadFileStatus,
  UploadProps,
} from "antd/es/upload/interface";
import axios from "axios";
import ProductCategory from "./ProductCategory";

interface ProductInfoProps {
  product: Partial<Product>;
  categories: Category[];
  onChange: (updatedInfo: Partial<Product>) => void;
  onFilesChange: (files: File[]) => void;
  onImagesToDeleteChange: (images: string[]) => void;
}

const baseUrl = import.meta.env.VITE_API_URL;

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  categories,
  onChange,
  onFilesChange,
  onImagesToDeleteChange,
}) => {
  const [newImage, setNewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const objectUrlsRef = useRef<Record<string, string>>({});
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Giải phóng bộ nhớ khi component unmount
  useEffect(() => {
    return () => {
      Object.values(objectUrlsRef.current).forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    onChange({ [name]: newValue });
  };

  const handleCategoryChange = (selectedCategoryIds: string[]) => {
    // Tạo mảng các object category từ các id đã chọn
    const selectedCategories = categories.filter((cat) =>
      selectedCategoryIds.includes(cat._id)
    );

    onChange({ categories: selectedCategories });
  };

  // Khởi tạo danh sách ảnh từ sản phẩm
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const initialFileList: UploadFile[] = product.images.map(
        (url, index) => ({
          // uid: `${index}`,
          uid: `url-${index}-${Date.now()}`,
          name: `image-${index}.jpg`,
          status: "done",
          url,
        })
      );
      setFileList(initialFileList);
    }
  }, [product.images]);

  const handleAddImage = () => {
    if (newImage.trim()) {
      const updatedImages = [...(product.images || []), newImage.trim()];
      onChange({ images: updatedImages });
      setNewImage("");
    }
  };

  // const handleUploadChange: UploadProps['onChange'] = async (info) => {
  //   const newFiles = info.fileList.filter(
  //     file => !file.url && !file.response && file.originFileObj
  //   );

  //   const uploadedFilesSoFar = info.fileList.filter(
  //     file => file.status === 'done' && file.url
  //   );
  //   setFileList(uploadedFilesSoFar);

  //   if (newFiles.length === 0) return;

  //   setUploading(true);

  //   try {
  //     const uploadPromises = newFiles.map(async (file) => {
  //       try {
  //         const formData = new FormData();
  //         formData.append("image", file.originFileObj as File);

  //         const response = await axios.post<{ imageUrl: string }>(
  //           `${baseUrl}/api/product/upload/${product._id}`,
  //           formData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //             onUploadProgress: (progressEvent) => {
  //               if (progressEvent.total) {
  //                 const percent = Math.round(
  //                   (progressEvent.loaded * 100) / progressEvent.total
  //                 );
  //                 setFileList(prev => prev.map(f =>
  //                   f.uid === file.uid ? { ...f, percent } : f
  //                 ));
  //               }
  //             },
  //           }
  //         );

  //         if (response.data?.imageUrl) {
  //           return {
  //             ...file,
  //             status: 'done' as const,
  //             url: response.data.imageUrl,
  //             response: response.data,
  //             percent: 100
  //           };
  //         }
  //         throw new Error('No image URL returned');
  //       } catch (error) {
  //         console.error("Error uploading image:", error);
  //         return {
  //           ...file,
  //           status: 'error' as const,
  //           error: error instanceof Error ? error : new Error('Upload failed')
  //         };
  //       }
  //     });

  //     const uploadedFiles = await Promise.all(uploadPromises);

  //     setFileList(prev => [
  //       ...prev.filter(f => !newFiles.some(nf => nf.uid === f.uid)),
  //       ...uploadedFiles
  //     ]);

  //     const newImageUrls = uploadedFiles
  //       .filter(file => file.status === 'done')
  //       .map(file => file.url)
  //       .filter((url): url is string => !!url);

  //     if (newImageUrls.length > 0) {
  //       onChange({
  //         images: [...(product.images || []), ...newImageUrls]
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error in upload process:", error);
  //     message.error("Upload process failed");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  // Handle file selection changes

  // const handleUploadChange: UploadProps['onChange'] = (info) => {
  //   // Get all selected files (including new ones)
  //   const selectedFiles = info.fileList
  //     .map(file => file.originFileObj)
  //     .filter(Boolean) as File[];

  //   setFilesToUpload(selectedFiles);
  //   onFilesChange(selectedFiles); // Pass files to parent

  //   // Update UI state
  //   setFileList(info.fileList.map(file => ({
  //     ...file,
  //     status: file.originFileObj ? 'uploading' : 'done',
  //     percent: file.originFileObj ? 0 : 100
  //   })));
  // };

  const handleUploadChange: UploadProps["onChange"] = (info) => {
    // Tạo URL tạm thời cho các file mới để hiển thị preview
    const newFileList = info.fileList.map((file) => {
      // Nếu file đã có URL (đã upload trước đó) thì giữ nguyên
      if (file.url || file.status === "done") return file;

      // Nếu file chưa có URL (file mới chọn) thì tạo object URL
      if (file.originFileObj) {
        const objectUrl = URL.createObjectURL(file.originFileObj);
        objectUrlsRef.current[file.uid] = objectUrl;
        return {
          ...file,
          url: objectUrl,
          status: "done" as UploadFileStatus, // Hiển thị như đã upload thành công
        };
      }

      return file;
    });

    setFileList(newFileList);

    // Lọc ra các file gốc để chuẩn bị upload sau này
    const files = newFileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj) as File[];

    onFilesChange(files);
  };

  const handleRemove = (file: UploadFile) => {
    const urlToRemove = file.url || (file.response && file.response.imageUrl);
    if (urlToRemove) {
      const updatedImages = (product.images || []).filter(
        (img) => img !== urlToRemove
      );
      onChange({ images: updatedImages });

      // Nếu là ảnh đã upload trước đó
      if (urlToRemove && product.images?.includes(urlToRemove)) {
        setImagesToDelete((prev) => {
          const newImagesToDelete = [...prev, urlToRemove];
          onImagesToDeleteChange(newImagesToDelete); // Gọi callback để cập nhật lên cha
          return newImagesToDelete;
        });
      }
    }
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
  };

  // Chuyển đổi danh sách category object thành mảng id cho ProductCategory
  const selectedCategoryIds = product.categories?.map((cat) => cat._id) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="product_name"
            value={product.product_name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <ProductCategory
          categories={categories}
          selectedCategories={selectedCategoryIds}
          onChange={handleCategoryChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product Images</label>

        {/* Upload bằng URL */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Paste image URL"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button
            type="primary"
            onClick={handleAddImage}
            className="bg-blue-500"
            disabled={uploading}
          >
            Add URL
          </Button>
        </div>

        {/* Upload bằng file sử dụng Ant Design */}
        <Upload
          multiple
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          onRemove={handleRemove}
          accept="image/*"
          beforeUpload={() => false}
        >
          {fileList.length >= 8 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="status"
          id="status"
          checked={product.status || false}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="status">Product is active</label>
      </div>
    </div>
  );
};

export default ProductInfo;
