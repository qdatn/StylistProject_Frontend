// app/admin/product/ProductCategories.tsx
import mockDiscounts, { Discount } from "@src/types/Discount";
import React, { useEffect, useState } from "react";
import DiscountTable from "./DiscountTable";

const DiscountManagement: React.FC = () => {
  const [Discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);

  // Lấy lại danh sách từ `mockDiscounts` mỗi khi component được render
  useEffect(() => {
    setDiscounts([...mockDiscounts]);
  }, []);

  return (
    <div>
      <div className="font-semibold text-xl p-6">Discount Page</div>
      <div>
        <DiscountTable
          discounts={Discounts}
        />
      </div>
    </div>
  );
};

export default DiscountManagement;