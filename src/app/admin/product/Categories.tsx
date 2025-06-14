import React, { useEffect, useState } from "react";
import CategoryTable from "./CategoriesTable";
import { Category, CategoryList, mockCategories } from "@src/types/Category";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
import { useLocation } from "react-router-dom";

const urlPath = import.meta.env.VITE_API_URL;

const Categories: React.FC = () => {
    const location = useLocation(); 
      const [refreshFlag, setRefreshFlag] = useState(0); 
      useEffect(() => {
        if (location.state?.refresh) {
          fetchCategoryItem(1, pageSize);
        }
      }, [location.state]);
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

    const pageSize =8
    useEffect(() => {
        fetchCategoryItem(pagination.currentPage!, pagination.pageSize!);
    }, []);

    useEffect(() => {
      console.log("Category", categories);
      console.log("pagination", pagination);
    }, [categories]);
    const refreshData = () => {
        // Fetch the updated data and set it to the state that controls `dataSource`
        fetchCategoryItem(pagination.currentPage!, pageSize!); // Your existing function to fetch updated data
    };
    const handlePageChange = (page: number) => {
        if (page <= pagination?.totalPages!) {
                setPagination({
                  ...pagination,
                  currentPage: page,
                });
        //setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
        fetchCategoryItem(page, pageSize);
    };
}
    return (
        <div>
            <div className="font-semibold text-xl p-6">Categories Page</div>
            <div> <CategoryTable
                categories={categories}
                onDeleteSuccess={refreshData}
                pagination={pagination}
                onPageChange={handlePageChange}
            />
            </div>
        </div>
    );
};

export default Categories;