import { Category } from "@/app/types/movie.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { categoryApi } from "../../service/api/category.api";

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Tên không được để trống")
        .max(255, "Tên quá dài"),

    slug: z
        .string()
        .min(1, "Slug không được để trống")
        .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function useCategoryForm(
    mode: "add" | "edit",
    initialData?: Category
) {
    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.reset({
                name: initialData.name,
                slug: initialData.slug,
            });
        }
    }, [mode, initialData, form]);
    return form;
}

export const useCategoryMutation = (
    mode: "add" | "edit",
    categoryId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CategoryFormValues) =>
            mode === "add"
                ? categoryApi.createCategory(data)
                : categoryApi.updateCategory(categoryId!, data),
        onSuccess: () => {
            router.refresh();
            onClose?.();
        },
    });
};