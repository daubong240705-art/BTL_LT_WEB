import { Category } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { CategoryPayload, categoryApi } from "../../service/api/category.api";

type ApiFailure = {
    statusCode?: number | string;
    error?: unknown;
};

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
    const form = useForm<CategoryPayload>({
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
    form: UseFormReturn<CategoryPayload>,
    categoryId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: CategoryPayload) => {
            const res = await (mode === "add"
                ? categoryApi.createCategory(data)
                : categoryApi.updateCategory(categoryId!, data));

            const apiRes = res as ApiFailure;
            const statusCode = Number(apiRes.statusCode ?? 200);
            if (statusCode >= 400 || apiRes.error) {
                throw res;
            }
            return res;
        },
        onSuccess: () => {
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            const serverError = (error as ApiFailure)?.error;

            if (serverError && typeof serverError === "object" && !Array.isArray(serverError)) {
                for (const [key, value] of Object.entries(serverError)) {
                    if (key === "slug") {
                        form.setError("slug", { type: "server", message: String(value) });
                    } else if (key === "name") {
                        form.setError("name", { type: "server", message: String(value) });
                    } else {
                        form.setError("root", { type: "server", message: String(value) });
                    }
                }
                return;
            }

            const message = typeof serverError === "string" ? serverError : "Khong the luu the loai";
            if (/slug/i.test(message)) {
                form.setError("slug", { type: "server", message });
                return;
            }

            form.setError("root", { type: "server", message });
        }
    });
};
