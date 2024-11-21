// app/admin/product/Categories.tsx
import React, { useEffect, useState } from "react";
import CategoryTable from "./CategoriesTable";
import { Category, mockCategories } from "@src/types/Category";

const Categories: React.FC = () => {
    useEffect(() => {
        setCategories([...mockCategories]);
    }, []);
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    return (
        <div>
            <div className="font-semibold text-xl p-6">Categories Page</div>
            <div> <CategoryTable
                categories={categories}
            />
            </div>
        </div>
    );
};

export default Categories;