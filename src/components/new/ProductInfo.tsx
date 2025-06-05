import React, { useEffect, useState } from 'react';
import { Category } from '@src/types/Category';
import { Product } from '@src/types/new/Product';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import ProductCategory from './ProductCategory';

interface ProductInfoProps {
  product: Partial<Product>;
  categories: Category[];
  onChange: (updatedInfo: Partial<Product>) => void;
}

const baseUrl = import.meta.env.VITE_API_URL;

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  categories,
  onChange,
}) => {
  const [newImage, setNewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

    onChange({ [name]: newValue });
  };

  const handleCategoryChange = (selectedCategoryIds: string[]) => {
    // Tạo mảng các object category từ các id đã chọn
    const selectedCategories = categories.filter(cat => 
      selectedCategoryIds.includes(cat._id)
    );
    
    onChange({ categories: selectedCategories });
  };

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const initialFileList: UploadFile[] = product.images.map((url, index) => ({
        uid: `${index}`,
        name: `image-${index}.jpg`,
        status: 'done',
        url,
      }));
      setFileList(initialFileList);
    }
  }, [product.images]);

  const handleAddImage = () => {
    if (newImage.trim()) {
      const updatedImages = [...(product.images || []), newImage.trim()];
      onChange({ images: updatedImages });
      setNewImage('');
    }
  };

  const handleUploadChange: UploadProps['onChange'] = async (info) => {
    const newFiles = info.fileList.filter(
      file => !file.url && !file.response && file.originFileObj
    );

    const uploadedFilesSoFar = info.fileList.filter(
      file => file.status === 'done' && file.url
    );
    setFileList(uploadedFilesSoFar);

    if (newFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = newFiles.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file.originFileObj as File);

          const response = await axios.post<{ imageUrl: string }>(
            `${baseUrl}/api/product/upload/${product._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setFileList(prev => prev.map(f =>
                    f.uid === file.uid ? { ...f, percent } : f
                  ));
                }
              },
            }
          );

          if (response.data?.imageUrl) {
            return {
              ...file,
              status: 'done' as const,
              url: response.data.imageUrl,
              response: response.data,
              percent: 100
            };
          }
          throw new Error('No image URL returned');
        } catch (error) {
          console.error("Error uploading image:", error);
          return {
            ...file,
            status: 'error' as const,
            error: error instanceof Error ? error : new Error('Upload failed')
          };
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      setFileList(prev => [
        ...prev.filter(f => !newFiles.some(nf => nf.uid === f.uid)),
        ...uploadedFiles
      ]);

      const newImageUrls = uploadedFiles
        .filter(file => file.status === 'done')
        .map(file => file.url)
        .filter((url): url is string => !!url);

      if (newImageUrls.length > 0) {
        onChange({
          images: [...(product.images || []), ...newImageUrls]
        });
      }

    } catch (error) {
      console.error("Error in upload process:", error);
      message.error("Upload process failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (file: UploadFile) => {
    const urlToRemove = file.url || (file.response && file.response.imageUrl);
    if (urlToRemove) {
      const updatedImages = (product.images || []).filter(img => img !== urlToRemove);
      onChange({ images: updatedImages });
    }
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    setFileList(newFileList);
  };

  // Chuyển đổi danh sách category object thành mảng id cho ProductCategory
  const selectedCategoryIds = product.categories?.map(cat => cat._id) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input
            type="text"
            name="product_name"
            value={product.product_name || ''}
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
            value={product.brand || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={product.description || ''}
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