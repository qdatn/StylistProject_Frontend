import React, { useState } from "react";
import AttributesForm from "./AttributeForm";
import BasicProductInfo from "./ProductInfo";
import CategoriesForm from "./CategoryForm";
import { Product } from "@src/types/Product";
import { Attribute } from "@src/types/Attribute";
import { Button } from "antd";
import { Category } from "@src/types/Category";
// Tách các phần của form

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  type: string;
}
const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct = {},
  onSave,
  onCancel,
  type,
}) => {
  const [product, setProduct] = useState<Product>({
    _id: "",
    product_name: "",
    price: 0,
    discountedPrice: 0,
    description: "",
    brand: null,
    stock_quantity: 0,
    status: true,
    images: [],
    attributes: [],
    categories: [],
    createdAt: undefined,
    updatedAt: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  // Nhận dữ liệu attributes từ AttributesForm
  const handleAttributesChange = (attributes: Attribute[]) => {
    setProduct({ ...product, attributes }); // Cập nhật vào product
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  const handleSave = () => {
    const validationErrors = validateBasicInfo(product);
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Nếu có lỗi, hiển thị lỗi
      return;
    }
  
    const productToSave = { ...product };
    // if (type === "create") {
    //   delete productToSave._id; // Xóa `_id` khi tạo mới
    // }
  
    // Gọi hàm onSave với dữ liệu đã chuẩn bị
    onSave(productToSave);
  };
  const validateBasicInfo = (product: Partial<Product>) => {
    const newErrors: Record<string, string> = {};
    if (!product.product_name) newErrors.name = "Product name is required.";
    if (!product.price || product.price <= 0)
        newErrors.originalPrice = "Original price must be greater than 0.";
    if (product.discountedPrice !== undefined && product.discountedPrice < 0)
        newErrors.discountedPrice = "Discounted price must not be negative.";
    if (!product.brand) newErrors.brand = "Brand is required.";
    if (product.stock_quantity !== undefined && product.stock_quantity < 0)
        newErrors.stock_quantity = "Stock quantity cannot be negative.";
    return newErrors;
};

  return (
    <form>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <BasicProductInfo product={product} setProduct={setProduct} type={type} errors={errors} />
        <AttributesForm onAttributesChange={handleAttributesChange} />
        <CategoriesForm
                    categories={categories}
                    setCategories={setCategories}
                    onSelectedCategoriesChange={setSelectedCategories} // Pass callback
                />
        <div className="flex flex-row gap-2 justify-end">
          <div className="flex ">
            <Button className=" text-[16px] p-4 w-32 mt-6" onClick={handleSave}>
              Save
            </Button>
          </div>
          <div className="flex justify-end">
            <Button className=" text-[16px] p-4 w-32 mt-6" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;


