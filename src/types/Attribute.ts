import { PaginationType } from "./Pagination";

// models/Attribute.ts
export interface Attribute {
  key: string;
  value: string[];
}

export interface OrderAttribute {
  key: string;
  value: string;
}
export interface AttributeList {
  data: Attribute[];
  pagination: PaginationType;
}

export const mockAttributes: Attribute[] = [
  {
    key: "Color",
    value: ["Red", "Blue", "Green", "Black"],
  },
  {
    key: "Material",
    value: ["Cotton", "Polyester", "Wool"],
  },
  {
    key: "Size",
    value: ["S", "M", "L", "XL"],
  },
  {
    key: "Style",
    value: ["Casual", "Formal", "Sporty"],
  },
  {
    key: "Fit",
    value: ["Slim", "Regular", "Loose"],
  },
];
