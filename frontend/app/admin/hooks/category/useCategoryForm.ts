"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { assertApiSuccess, handleFormError } from "../_shared/mutation.utils";
import { categoryApi } from "../../service/api/category.api";
import { CategoryPayload, categorySchema } from "@/app/types/form.type";
import { toast } from "sonner";



export function useCategoryForm(
    mode: "add" | "edit",
    initialData?: Category
) {
    const form = useForm<CategoryPayload>({
        resolver: zodResolver(categorySchema),
        values: mode === "edit" && initialData
            ? {
                name: initialData.name,
                slug: initialData.slug,
            }
            : {
                name: "",
                slug: "",
            }
    });
    return form;
}

export const useCategoryMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<CategoryPayload>,
    categoryId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation<IBackendRes<Category>, IBackendRes<null>, CategoryPayload>({
        mutationFn: async (data: CategoryPayload) => {
            const response = await (mode === "add"
                ? categoryApi.createCategory(data)
                : categoryApi.updateCategory(categoryId!, data));
            return assertApiSuccess(response);
        },
        onSuccess: (res) => {
            router.refresh();
            const categoryName = res.data?.name || "thể loại";
            toast.success(
                mode === "add" ? `Tạo ${categoryName} thành công!` : `Cập nhật ${categoryName} thành công!`
            );
            onClose?.();
        },
        onError: (err) => {
            handleFormError(err, form.setError);
        }
    });
};
