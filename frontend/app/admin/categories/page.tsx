"use client"
import { fetchCategories } from "@/lib/api/category";
import { useQuery } from "@tanstack/react-query";
import CategoryTable from "./CategoryTable";

export default function AdminCategoriesPage() {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    })

    return (
        <CategoryTable categories={categories} isLoading={isLoading} />
    );
}