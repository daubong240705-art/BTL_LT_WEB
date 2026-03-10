"use client";

import { useDeleteWithRefresh } from "../_shared/mutation.utils";
import { movieApi } from "../../service/api/movie.api";

export const useDeleteMovie = () => {
    const mutation = useDeleteWithRefresh(movieApi.deleteMovie, "Xoa thanh cong");

    return {
        deleteMovie: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};
