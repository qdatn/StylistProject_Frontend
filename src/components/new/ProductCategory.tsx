// src/components/ProductCategory.tsx
import React from 'react';
import { Category } from '@src/types/Category';

interface ProductCategoryProps {
  selectedCategories: string[];
  categories: Category[];
  onChange: (updatedCategories: string[]) => void;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({
  selectedCategories,
  categories,
  onChange,
}) => {
  const handleToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Categories</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {categories.map(category => (
          <label key={category._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category._id)}
              onChange={() => handleToggle(category._id)}
            />
            <span>{category.category_name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
