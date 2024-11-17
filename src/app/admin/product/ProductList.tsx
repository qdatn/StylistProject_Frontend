<<<<<<< HEAD
// pages/ProductManagementPage.tsx
import React from "react";
import { ProductTable } from "@components/ProductTable";
import mockProducts from "@src/types/Product";

const ProductManagementPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <ProductTable products={mockProducts} />
    </div>
  );
};

export default ProductManagementPage;
=======
// app/admin/product/ProductList.tsx
import ProductTable from "./ProductTable";
import React from "react";

const ProductList: React.FC = () => {
  return(

  <div>
    <div className="font-semibold text-xl p-6">Product List</div>
    <div><ProductTable/></div>
  </div>
  );
};

export default ProductList;
>>>>>>> huong
