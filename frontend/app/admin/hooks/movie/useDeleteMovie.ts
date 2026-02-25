"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { movieApi } from "../../service/api/movie.api";


export const useDeleteMovie = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (id: number) => movieApi.deleteMovie(id),

        onSuccess: () => {
            router.refresh();
        },
    });

    return {
        deleteMovie: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};