"use client";

import { useDeleteWithRefresh } from "../_shared/mutation.utils";
import { categoryApi } from "../../service/api/category.api";

export const useDeleteCategory = () => {
    const mutation = useDeleteWithRefresh(categoryApi.deleteCategory, "Xoa the loai thanh cong");

    return {
        deleteCategory: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};
