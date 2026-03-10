
"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { applyFormMutationError, assertApiSuccess } from "../_shared/mutation.utils";
import { MoviePayload, movieApi } from "../../service/api/movie.api";
import { toast } from "sonner";

const movieSchema = z
    .object({
        title: z
            .string()
            .min(1, "Tiêu đề không được để trống")
            .max(255, "Tiêu đề quá dài"),

        slug: z
            .string()
            .min(1, "Slug không được để trống")
            .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),

        description: z
            .string()
            .min(1, "Mô tả không được để trống"),

        type: z.enum(["SINGLE", "SERIES"], {
            message: "Type không hợp lệ",
        }),

        status: z.enum(["ONGOING", "COMPLETED"], {
            message: "Status không hợp lệ",
        }),

        posterUrl: z
            .string()
            .url("Poster phải là URL hợp lệ")
            .optional()
            .or(z.literal("")),

        thumbUrl: z
            .string()
            .url("Thumbnail phải là URL hợp lệ")
            .optional()
            .or(z.literal("")),

        publishYear: z.preprocess(
            (val) => Number(val),
            z.number()
                .int("Năm phải là số nguyên")
                .min(1900, "Năm không hợp lệ")
                .max(new Date().getFullYear(), "Năm không hợp lệ")
        ),

        categoryIds: z
            .array(z.number().int().positive())
            .min(1, "Phải chọn ít nhất 1 thể loại"),
    })

export type MovieFormValues = z.infer<typeof movieSchema>;

export function useMovieForm(
    mode: "add" | "edit",
    initialData?: Movie
) {

    const form = useForm<MoviePayload>({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            type: "SINGLE",
            status: "ONGOING",
            posterUrl: "",
            thumbUrl: "",
            publishYear: new Date().getFullYear(),
            categoryIds: [],
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.reset({
                title: initialData.title,
                slug: initialData.slug,
                description: initialData.description,
                type: initialData.type,
                status: initialData.status,
                posterUrl: initialData.posterUrl,
                thumbUrl: initialData.thumbUrl,
                publishYear: initialData.publishYear,
                categoryIds: initialData.categories?.map(c => c.id) ?? [],
            });
        }
    }, [mode, initialData, form]);

    return form;
}

export const useMovieMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<MoviePayload>,
    movieId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: MoviePayload) => {
            const response = await (mode === "add"
                ? movieApi.createMovie(data)
                : movieApi.updateMovie(movieId!, data));
            return assertApiSuccess(response);
        },

        onSuccess: () => {
            router.refresh();
            const isAddMode = mode === "add";
            toast.success(
                isAddMode ? "Tạo phim mới thành công" : "Cập nhật thành công"
            );

            onClose?.();
        },
        onError: (error: unknown) => {
            applyFormMutationError(form, error, {
                fallbackMessage: "Khong the luu phim",
                fieldMap: {
                    slug: "slug",
                },
                messageRules: [{ pattern: /slug/i, field: "slug" }],
            });
        }
    });
};
