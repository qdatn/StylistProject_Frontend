import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Input, Checkbox, message, DatePicker } from 'antd';
import { Discount } from '@src/types/Discount';
import { Product } from '@src/types/Product';
import { Category } from '@src/types/Category';
import { formatCurrency } from '@utils/format';
import moment from 'moment';

const { Option } = Select;

type DiscountType = 'all' | 'product' | 'category';

interface DiscountFormProps {
  initialDiscount?: Partial<Discount>;
  onSave: (discount: Partial<Discount>) => void;
  onCancel: () => void;
  products: Product[]; // Mock data for products
  categories: Category[]; // Mock data for categories
  type: string;
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  initialDiscount = {},
  onSave,
  onCancel,
  products,
  categories,
  type,
}) => {
  const [discount, setDiscount] = useState<Partial<Discount>>(initialDiscount);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appliesToType, setAppliesToType] = useState<DiscountType>(
    initialDiscount?.type ? initialDiscount.type as DiscountType : 'all'
  );
  const [appliesToItems, setAppliesToItems] = useState<(string | Product | Category)[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialDiscount) {
      const type = initialDiscount.type as DiscountType || 'all';
      setAppliesToType(type);

      // Convert apply_items to array of IDs
      const items = initialDiscount.apply_items
        ? initialDiscount.apply_items.map(item =>
          typeof item === 'object' ? (item as Product | Category)._id : item
        )
        : [];
      setAppliesToItems(items);

      form.setFieldsValue({
        ...initialDiscount,
        type: type,
        apply_items: type === 'all' ? undefined : items,
        start_date: initialDiscount.start_date ? moment(initialDiscount.start_date) : null,
        end_date: initialDiscount.end_date ? moment(initialDiscount.end_date) : null,
      });
    }
  }, [initialDiscount, products, categories, form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  };


  const handleTypeChange = (value: DiscountType) => {
    setAppliesToType(value);
    setDiscount((prev) => ({
      ...prev,
      type: value,
    }));
    if (value === 'all') {
      form.setFieldsValue({ apply_items: undefined });
    }
    setAppliesToItems(initialDiscount.apply_items || []); // Danh sách sản phẩm/danh mục được áp dụng
  };

  const handleDateChange = (date: moment.Moment | null, field: "start_date" | "end_date") => {
    if (date) {
      setDiscount((prev) => ({
        ...prev,
        [field]: date.toDate(), // Đảm bảo lưu ngày dưới dạng Date object
      }));
    } else {
      setDiscount((prev) => ({
        ...prev,
        [field]: undefined, // Nếu không có ngày chọn thì xóa giá trị
      }));
    }
  };
  const handleSelectChange = (values: string[]) => {
    setAppliesToItems(values);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!discount.code) newErrors.code = 'Discount code is required.';
    if (!discount.type) newErrors.type = 'Discount type is required.';
    if (!discount.value) newErrors.value = 'Discount value is required.';

    // If type is "product" or "category", at least one item must be selected
    if ((discount.type === 'product' || discount.type === 'category') && appliesToItems.length === 0) {
      newErrors.appliesTo = `Please select at least one ${discount.type}.`;
    }

    // Validate optional fields
    if (discount.minimum_value !== undefined && discount.minimum_value < 0) {
      newErrors.minimum_value = 'Minimum value must be a positive number.';
    }
    if (discount.max_discount !== undefined && discount.max_discount < 0) {
      newErrors.max_discount = 'Max discount must be a positive number.';
    }
    if (discount.usage_limit !== undefined && discount.usage_limit < 0) {
      newErrors.usage_limit = 'Usage limit must be a positive number.';
    }
    if (discount.used_count !== undefined && discount.used_count < 0) {
      newErrors.used_count = 'Used count must be a positive number.';
    }

    // Validate boolean status
    if (discount.status !== undefined && typeof discount.status !== 'boolean') {
      newErrors.status = 'Status must be true or false.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const formattedApplyItems = appliesToItems.map((item) =>
        typeof item === 'string' ? item : item._id
      );

      onSave({
        ...discount,
        apply_items: appliesToType === 'all' ? [] : formattedApplyItems,
      });
      message.success('Discount saved successfully!');
    }
  };
  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
        <div>
          <label className="block font-medium">Discount Code</label>
          <Input
            type="text"
            name="code"
            value={discount.code || ''}
            onChange={handleChange}
            placeholder="Enter Discount Code"
            className={`w-full mt-1 p-2 border rounded-md ${errors.code ? 'border-red-500' : ''}`}
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>
        <div>
          <label className="block font-medium">Discount Value (%)</label>
          <Input
            type="number"
            name="value"
            value={discount.value || 0}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="Enter Discount Value"
            className={`w-full mt-1 p-2 border rounded-md ${errors.value ? 'border-red-500' : ''}`}
          />
          {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
        </div>
        <div>
          <div className='flex flex-grow gap-3'>
            <label className="block font-medium">
              Minimum Value:
            </label>
            <p className='pr-1 pl-1 text-blue-600 rounded-sm border border-blue-200 bg-blue-50'>
              {formatCurrency(discount.minimum_value || 0)}
            </p>
          </div>
          <Input
            type="number"
            name="minimum_value"
            value={discount.minimum_value || 0}
            onChange={handleChange}
            min="0"
            className={`w-full mt-1 p-2 border rounded-md ${errors.minimum_value ? 'border-red-500' : ''}`}
          />
          {errors.minimum_value && <p className="text-red-500 text-sm">{errors.minimum_value}</p>}
        </div>
        <div>
          <div className='flex flex-grow gap-3'>
            <label className="block font-medium">
              Max Discount:
            </label>
            <p className='pr-1 pl-1 text-green-600 rounded-sm border border-green-200 bg-green-50'>
              {formatCurrency(discount.max_discount || 0)}
            </p>
          </div>
          <Input
            type="number"
            name="max_discount"
            value={discount.max_discount || 0}
            min="0"
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md ${errors.max_discount ? 'border-red-500' : ''}`}
          />
          {errors.max_discount && <p className="text-red-500 text-sm">{errors.max_discount}</p>}
        </div>
      </div>

      <div className="pb-5 w-full md:w-1/2 lg:w-1/2 justify-center pr-6">
        <div className="pb-5">
          <label className="block font-medium">Discount Type</label>
          <Select
            value={discount.type as DiscountType || 'all'}
            onChange={handleTypeChange}
            className="w-full mt-1"
          >
            <Option value="all">All</Option>
            <Option value="product">Product</Option>
            <Option value="category">Category</Option>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        {(discount.type === "product" || discount.type === "category") && (
          <div>
            <label className="block font-medium">
              {discount.type === "product" ? "Products" : "Categories"}
            </label>
            <Select
              mode="multiple"
              placeholder={`Select ${discount.type === "product" ? "products" : "categories"}`}
              onChange={handleSelectChange}
              value={appliesToItems
                .filter((item) =>
                  discount.type === "product"
                    ? products.some((product) => product._id === (typeof item === "string" ? item : item._id))
                    : categories.some((category) => category._id === (typeof item === "string" ? item : item._id))
                )
                .map((item) =>
                  typeof item === "string"
                    ? item
                    : discount.type === "product"
                      ? (item as Product).product_name
                      : (item as Category).category_name
                )}
              className="w-full mt-1"
              showSearch
              optionFilterProp="children"
            >
              {discount.type === "product"
                ? products.map((product) => (
                  <Option key={product._id} value={product._id}>
                    {product.product_name}
                  </Option>
                ))
                : categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.category_name}
                  </Option>
                ))}
            </Select>
            {errors.appliesTo && <p className="text-red-500 text-sm">{errors.appliesTo}</p>}
          </div>
        )
        }

      </div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
        <div>
          <label className="block font-medium">Usage Limit</label>
          <Input
            type="number"
            name="usage_limit"
            value={discount.usage_limit || 0}
            onChange={handleChange}
            min="0"
            className={`w-full mt-1 p-2 border rounded-md ${errors.usage_limit ? 'border-red-500' : ''}`}
          />
          {errors.usage_limit && <p className="text-red-500 text-sm">{errors.usage_limit}</p>}
        </div>
        <div>
          <label className="block font-medium">Used Count</label>
          <Input
            type="number"
            name="used_count"
            value={discount.used_count || 0}
            min="0"
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md ${errors.used_count ? 'border-red-500' : ''}`}
          />
          {errors.used_count && <p className="text-red-500 text-sm">{errors.used_count}</p>}
        </div>
        <div>
          <label className="block font-medium">Start Date</label>
          <DatePicker
            type="date"
            name="start_date"
            format="DD-MM-YYYY" // Định dạng ngày
            value={discount.start_date ? moment(discount.start_date) : null}
            onChange={(date) => handleDateChange(date, "start_date")}
            placeholder="Select start date"
            className={`w-full mt-1 p-2 border rounded-md ${errors.startDate ? 'border-red-500' : ''}`}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>
        <div>
          <label className="block font-medium">End Date</label>
          <DatePicker
            type="date"
            name="end_date"
            format="DD-MM-YYYY" // Định dạng ngày
            value={discount.end_date ? moment(discount.end_date) : null}
            onChange={(date) => handleDateChange(date, "end_date")}
            placeholder="Select end date"
            className={`w-full mt-1 p-2 border rounded-md ${errors.endDate ? 'border-red-500' : ''}`}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </div>
        <div className='flex items-center space-x-4'>
          <label className="block font-medium">Status: </label>
          <Checkbox
            checked={discount.status}
            onChange={(e) => setDiscount({ ...discount, status: e.target.checked })}
            className={`text-lg font-medium  ${errors.status ? "text-red-500" : ""}`}
          >
            Active
          </Checkbox>

          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <Button
          className="text-[16px] p-4 w-32 mt-6"
          type="primary"
          onClick={handleSave}>
          Save
        </Button>
        <Button
          className="text-[16px] p-4 w-32 mt-6"
          onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default DiscountForm;
