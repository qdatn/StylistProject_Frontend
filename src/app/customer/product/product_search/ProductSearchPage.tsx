import ProductListPage from "@app/customer/product";
import FilterProduct from "@components/ProductFilterForm";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ProductSearchPage: React.FC = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { name, category, sortBy, sortOrder } = location.state || "";
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sortBy") || "product_name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // navigate(`/product/search/query`, {
  //   state: {
  //     name: name,
  //     category: category || "All",
  //     sortBy: sortBy || "product_name",
  //     sortOrder: sortOrder || "asc",
  //   },
  // });
  return (
    <>
      <FilterProduct />
      <ProductListPage
        name={name}
        category={category}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default ProductSearchPage;
