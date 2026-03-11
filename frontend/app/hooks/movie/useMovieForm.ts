"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { assertApiSuccess, handleFormError, useDeleteWithRefresh } from "../_shared/mutation.utils";
import { movieApi } from "../../admin/service/api/movie.api";
import { toast } from "sonner";
import { MoviePayload, movieSchema } from "@/app/types/form.type";


export function useMovieForm(
    mode: "add" | "edit",
    initialData?: Movie
) {
    const form = useForm<MoviePayload>({
        resolver: zodResolver(movieSchema),
        values: mode === "edit" && initialData
            ? {
                title: initialData.title,
                slug: initialData.slug,
                description: initialData.description,
                type: initialData.type,
                status: initialData.status,
                posterUrl: initialData.posterUrl ?? "",
                thumbUrl: initialData.thumbUrl ?? "",
                publishYear: initialData.publishYear,
                categoryIds: initialData.categories?.map(c => c.id) ?? [],
            }
            : {
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


    return form;
}

export const useMovieMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<MoviePayload>,
    movieId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation<IBackendRes<Movie>, IBackendRes<null>, MoviePayload>({
        mutationFn: async (data: MoviePayload) => {
            const response = await (mode === "add"
                ? movieApi.createMovie(data)
                : movieApi.updateMovie(movieId!, data));
            return assertApiSuccess(response);
        },

        onSuccess: (res) => {
            router.refresh();
            const movieName = res.data?.title || "phim";
            toast.success(
                mode === "add" ? `Tạo ${movieName} thành công!` : `Cập nhật ${movieName} thành công!`
            );

            onClose?.();
        },
        onError: (err) => {
            handleFormError(err, form.setError);
        }
    });
};

export const useDeleteMovie = () => {
    const mutation = useDeleteWithRefresh(movieApi.deleteMovie, "Xoá thành công");

    return {
        deleteMovie: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};
