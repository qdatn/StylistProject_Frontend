import React, { useEffect, useState } from "react";
import { Button, Checkbox, message } from "antd";
import { Product } from "@src/types/Product";
import { Attribute } from "@src/types/Attribute";
import { Category } from "@src/types/Category";
import BasicProductInfo from "./ProductInfo";
import AttributesForm from "./AttributeForm";
import CategoriesForm from "./CategoryForm";

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
  const [product, setProduct] = useState<Partial<Product>>(initialProduct);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Cập nhật danh mục khi nhận dữ liệu từ `CategoriesForm`
  useEffect(() => {
    if (initialProduct.categories && Array.isArray(initialProduct.categories)) {
      const categoryIds = (initialProduct.categories as Category[]).map((category) => category._id);
      setSelectedCategories(categoryIds);
    }

    if (initialProduct.attributes) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        attributes: initialProduct.attributes,
      }));
    }
  }, [initialProduct]);

  const handleAttributesChange = (attributes: Attribute[]) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      attributes,
    }));
  };
  const validateBasicInfo = (product: Partial<Product>) => {
    const newErrors: Record<string, string> = {};
    if (!product.product_name) newErrors.name = "Product name is required.";
    if (!product.price || product.price <= 0) newErrors.originalPrice = "Original price must be greater than 0.";
    // if (
    //   product.discounted_price !== undefined && 
    //   product.discounted_price < 0 || (
    //     !product.discounted_price || !product.price ||
    //     product.discounted_price > product.price
    //   )
    // ) 
    // {
    //   message.error(`Discounted price cannot be greater than original price.`)
    //   newErrors.discounted_price = " Discounted price cannot be negative.";
    // }
    if (product.stock_quantity !== undefined && product.stock_quantity < 0) newErrors.stock_quantity = "Stock quantity cannot be negative.";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateBasicInfo(product);
    if (product.images && !Array.isArray(product.images)) {
      product.images = [product.images];
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const productToSave = {
      ...product,
      categories: selectedCategories,
    };
    onSave(productToSave);
  };

  return (
    <form>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <BasicProductInfo product={product} setProduct={setProduct} type={type} errors={errors} />
        <AttributesForm onAttributesChange={handleAttributesChange} initialAttributes={product.attributes || []} />
        <CategoriesForm
          onSelectedCategoriesChange={setSelectedCategories}
          selectedCategories={selectedCategories}
        />
        <div>
          <label className="block font-medium">Status</label>
          <Checkbox
            checked={product.status}
            onChange={(e) =>
              setProduct({ ...product, status: e.target.checked })
            }
            className={`mt-1 font-medium text-base ${errors.status ? "text-red-500" : ""}`}
          >
            Active
          </Checkbox>
          {errors.status && (
            <p className="font-medium text-red-500">{errors.status}</p>
          )}
        </div>
        <div className="flex flex-row gap-2 justify-end">
          <Button
            type="primary"
            className="text-[16px] p-4 w-32 mt-6"
            onClick={handleSave}>
            Save
          </Button>
          <Button className="text-[16px] p-4 w-32 mt-6" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
