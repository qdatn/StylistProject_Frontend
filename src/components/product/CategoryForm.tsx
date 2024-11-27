import React, { useEffect, useState } from "react";
import { Category, CategoryList } from "@src/types/Category";
import { IoAddSharp, IoClose } from "react-icons/io5";
import { Button } from "antd";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

interface CategoriesFormProps {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    onSelectedCategoriesChange: (selectedCategories: string[]) => void; // New prop
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({ categories, setCategories, onSelectedCategoriesChange }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = useState<Record<string, Set<string>>>( {});
    const [showNewCategoryForm, setShowNewCategoryForm] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<Partial<Category>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axiosClient.getOne<CategoryList>(`${baseUrl}/api/category`);
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle checkbox change
    const handleCategoryCheckboxChange = (categoryId: string) => {
        setSelectedCategories((prev) => {
            const updated = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId];
            onSelectedCategoriesChange(updated); // Notify parent component
            return updated;
        });
    };

    // Add category to the database
    const addCategoryToDB = async (category: Category) => {
        try {
            await axiosClient.post<Category>(`${baseUrl}/api/category`, category);
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // Handle field change for new category
    const handleNewCategoryFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
    };

    // Toggle new category form visibility
    const toggleNewCategoryForm = () => {
        setShowNewCategoryForm((prev) => !prev);
        setNewCategory({category_name: "", description: "" });
        setErrors((prevErrors) => ({ ...prevErrors, newCategory: "" }));
    };

    // Add new category
    const handleAddNewCategory = () => {
        if (!newCategory.category_name) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                newCategory: "Category ID and name are required.",
            }));
            return;
        }

        const categoryToAdd: Category = { ...newCategory, id: newCategory._id! } as Category;
        addCategoryToDB(categoryToAdd);
        setCategories([...categories, newCategory as Category]);
        setShowNewCategoryForm(false);
    };

    return (
        <div>
            <label className="block font-medium">Category</label>
            <div className="flex flex-row pt-3 pb-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
                    {categories.map((category) => (
                        <div key={category._id} className="flex items-center text-[15px]">
                            <input
                                type="checkbox"
                                id={category._id}
                                value={category._id}
                                checked={selectedCategories.includes(category._id)}
                                onChange={() => handleCategoryCheckboxChange(category._id)}
                                className="mr-2"
                            />
                            <label htmlFor={category._id}>{category.category_name}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <button
                    onClick={toggleNewCategoryForm}
                    className="text-black pt-2 text-[15px] rounded-md flex flex-row gap-2 justify-center items-center"
                >
                    Add new category
                    {showNewCategoryForm ? <IoClose /> : <IoAddSharp />}
                </button>
                {showNewCategoryForm && (
                    <div>
                        <input
                            type="text"
                            name="category_name"
                            value={newCategory.category_name || ""}
                            onChange={handleNewCategoryFieldChange}
                            placeholder="Category Name"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        <input
                            type="text"
                            name="description"
                            value={newCategory.description || ""}
                            onChange={handleNewCategoryFieldChange}
                            placeholder="Description"
                            className="w-full mb-2 p-2 border rounded-md"
                        />
                        {errors.newCategory && (
                            <p className="text-red-500 text-sm">{errors.newCategory}</p>
                        )}
                        <Button className="text-[16px] p-4 w-full" onClick={handleAddNewCategory}>
                            Add Category
                        </Button>
                    </div>
                )}

                {errors.categories && (
                    <p className="text-red-500 text-sm">{errors.categories}</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesForm;
