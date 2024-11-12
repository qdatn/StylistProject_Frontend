// app/admin/product/Categories.tsx
import React from "react";
import CategoryTable from "./CategoriesTable";

const Categories: React.FC = () => {
    return (
        <div>
            <div className="font-semibold text-xl p-6">Categories Page</div>
            <div> <CategoryTable /></div>
        </div>
    );
};

export default Categories;