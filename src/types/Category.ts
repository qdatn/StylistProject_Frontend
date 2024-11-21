export interface Category {
    _id: string;         // Each category has a unique ID
    category_name: string;         // Name of the category
    description?: string;          // Description (optional)
  }
  
  export const mockCategories: Category[] = [
    {
    _id: '1',
    category_name: "Women's Fashion",
    description: "Fashion products for women",
    },
    {
      _id: '2',
      category_name: "Men's Fashion",
      description: "Fashion products for men",
    },
    {
      _id: '3',
      category_name: "Accessories",
      description: "Various accessories",
    },
    { _id: '4', category_name: "Dresses", description: "Women's dresses" }
]