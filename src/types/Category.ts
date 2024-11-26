import { PaginationType } from "./Pagination";

export interface Category {
  _id: string; // Each category has a unique ID
  category_name: string; // Name of the category
  description?: string; // Description (optional)
}
export interface CategoryList {
  data: Category[];
  pagination: PaginationType;
}

export const mockCategories: Category[] = [
  // {
  //   _id: "673636000997564f1969aebd",
  //   category_name: "Women's Fashion",
  //   description: "Fashion products for women",
  // },
  // {
  //   _id: "673636000997564f1969aebb",
  //   category_name: "Men's Fashion",
  //   description: "Fashion products for men",
  // },
  // {
  //   _id: "673636000997564f1969aeba",
  //   category_name: "Accessories",
  //   description: "Various accessories",
  // },
  // {
  //   _id: "673636000997564f1969aebc",
  //   category_name: "Dresses",
  //   description: "Women's dresses",
  // },
];
