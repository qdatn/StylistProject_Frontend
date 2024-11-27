import ProductListPage from "@app/customer/product";
import FilterProduct from "@components/ProductFilterForm";

const ProductSearchPage: React.FC = () => {
  return (
    <>
      <FilterProduct />
      <ProductListPage />
    </>
  );
};

export default ProductSearchPage;
