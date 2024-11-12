export interface Category {
    category_id: string;         // Each category has a unique ID
    category_name: string;         // Name of the category
    description?: string;          // Description (optional)
  }
  
  export const mockCategories: Category[] = [
    {
    category_id: '1',
    category_name: "Women's Fashion",
    description: "Fashion products for women",
    },
    {
      category_id: '2',
      category_name: "Men's Fashion",
      description: "Fashion products for men",
    },
    {
      category_id: '3',
      category_name: "Accessories",
      description: "Various accessories",
    },
]