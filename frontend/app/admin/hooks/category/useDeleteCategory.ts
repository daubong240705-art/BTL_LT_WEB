"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { categoryApi } from "../../service/api/category.api";



export const useDeleteCategory = () => {
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: (id: number) => categoryApi.deleteCategory(id),
        onSuccess: () => {
            router.refresh();
        },
    });

    return {
        deleteMovie: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};