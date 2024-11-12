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
