// app/admin/category/Categories.tsx
import React, { useEffect, useState } from "react";
import CategoryTable from "./CategoriesTable";
import { Category, CategoryList, mockCategories } from "@src/types/Category";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";

const urlPath = import.meta.env.VITE_API_URL;

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<CategoryList>({
        data: [],
        pagination: {},
    });
    const [pagination, setPagination] = useState<PaginationType>({
        currentPage: 1,
        pageSize: 8,
        totalItems: 0,
        totalPages: 0,
    });

    const fetchCategoryItem = async (page: number, pageSize: number) => {
        try {
            const response = await axiosClient.getOne<CategoryList>(
                `${urlPath}/api/category/`,
                //pagination params
                { page: page, limit: pageSize }
            );

            setCategories(response);

            setPagination(response.pagination);
            // setHasMore(page < response.pagination.totalPages!);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        fetchCategoryItem(pagination.currentPage!, pagination.pageSize!);
    }, []);

    // useEffect(() => {
    //   console.log("Category", categories);
    //   console.log("pagination", pagination);
    // }, [categories]);
    const refreshData = () => {
        // Fetch the updated data and set it to the state that controls `dataSource`
        fetchCategoryItem(pagination.currentPage!, pagination.pageSize!); // Your existing function to fetch updated data
    };
    return (
        <div>
            <div className="font-semibold text-xl p-6">Categories Page</div>
            <div> <CategoryTable categories={categories} onDeleteSuccess={refreshData} />
            </div>
        </div>
    );
};

export default Categories;