// components/ProductTable.tsx
"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Product } from "@src/types/Product";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Checkbox } from "@components/ui/checkbox"; // Your custom checkbox component

type ProductTableProps = {
  products: Product[];
};

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [textFilter, setTextFilter] = useState<string>(""); // For filtering by product name
  const [statusFilter, setStatusFilter] = useState<string>(""); // For filtering by product status

  const handleProductSelection = (id: string) => {
    setSelectedProducts((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredData.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredData.map((product) => product.id)));
    }
  };

  const filteredData = products.filter((product) =>
    product.name.toLowerCase().includes(textFilter.toLowerCase()) &&
    (statusFilter === "" || (statusFilter === "Active" ? product.status : !product.status))
  );

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedProducts.size > 0 && selectedProducts.size === filteredData.length}
          indeterminate={selectedProducts.size > 0 && selectedProducts.size < filteredData.length}
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProducts.has(row.original.id)}
          onChange={() => handleProductSelection(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img src={row.getValue("image") as string} alt={row.getValue("name") as string} className="h-16 w-16 object-cover" />
      ),
    },
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "originalPrice",
      header: "Original Price",
      cell: ({ row }) => {
        const originalPrice = row.getValue("originalPrice") as number;
        return <div className="text-right">${originalPrice.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "discountedPrice",
      header: "Discounted Price",
      cell: ({ row }) => {
        const discountedPrice = row.getValue("discountedPrice") as number;
        return <div className="text-right">${discountedPrice.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => {
        const stockQuantity = row.getValue("stock_quantity") as number;
        return <div className="text-right">{stockQuantity}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return <div className="capitalize">{status ? "Active" : "Inactive"}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => handleProductAction(row.original)}>
          View Details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleProductAction = (product: Product) => {
    alert(`Product ID: ${product.id}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search product..."
          className="max-w-sm"
          onChange={(e) => setTextFilter(e.target.value)}
        />
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
