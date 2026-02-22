import { useQuery } from "@tanstack/react-query";
import { CategoryApi } from "../../service/api/category.api";

export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['public', 'categories'],
        queryFn: CategoryApi.getAllAdminCategories,
        staleTime: 5 * 60 * 1000,
    });
};