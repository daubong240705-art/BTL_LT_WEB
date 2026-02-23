import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../../service/api/category.api";

export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getAllAdminCategories,
    });
};