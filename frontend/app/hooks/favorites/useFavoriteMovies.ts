"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    addFavoriteMovie as addFavoriteMovieRequest,
    getFavoriteMovies as getFavoriteMoviesRequest,
    removeFavoriteMovie as removeFavoriteMovieRequest,
} from "@/lib/api/main.api";

type FavoriteQueryResult = {
    movies: Movie[];
    isAuthenticated: boolean;
};

type ToggleFavoriteResult = {
    success: boolean;
    isFavorite?: boolean;
    authRequired?: boolean;
    message?: string;
};

const FAVORITE_QUERY_KEY = ["favorite-movies"];

export function useFavoriteMovies() {
    const queryClient = useQueryClient();

    const favoritesQuery = useQuery<FavoriteQueryResult>({
        queryKey: FAVORITE_QUERY_KEY,
        queryFn: async () => {
            const res = await getFavoriteMoviesRequest();

            if (+res.statusCode === 401 || +res.statusCode === 403) {
                return {
                    movies: [],
                    isAuthenticated: false,
                };
            }

            return {
                movies: res.data ?? [],
                isAuthenticated: true,
            };
        },
    });

    const favoriteMovies = useMemo(
        () => favoritesQuery.data?.movies ?? [],
        [favoritesQuery.data?.movies]
    );
    const isAuthenticated = favoritesQuery.data?.isAuthenticated ?? true;

    const favoriteMovieIds = useMemo(
        () => new Set(favoriteMovies.map((movie) => movie.id)),
        [favoriteMovies]
    );

    const refreshFavorites = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY });
    }, [queryClient]);

    const toggleFavorite = useCallback(
        async (movie: Movie): Promise<ToggleFavoriteResult> => {
            const favorite = favoriteMovieIds.has(movie.id);

            const res = favorite
                ? await removeFavoriteMovieRequest(movie.id)
                : await addFavoriteMovieRequest(movie.id);

            if (+res.statusCode === 401 || +res.statusCode === 403) {
                return {
                    success: false,
                    authRequired: true,
                    message: "Vui lòng đăng nhập để dùng tính năng yêu thích.",
                };
            }

            if (+res.statusCode >= 400) {
                return {
                    success: false,
                    message: res.message || "Không thể cập nhật phim yêu thích.",
                };
            }

            await refreshFavorites();

            return {
                success: true,
                isFavorite: !favorite,
                message: res.message,
            };
        },
        [favoriteMovieIds, refreshFavorites]
    );

    const removeFavorite = useCallback(
        async (movieId: number): Promise<ToggleFavoriteResult> => {
            const res = await removeFavoriteMovieRequest(movieId);

            if (+res.statusCode === 401 || +res.statusCode === 403) {
                return {
                    success: false,
                    authRequired: true,
                    message: "Vui lòng đăng nhập để dùng tính năng yêu thích.",
                };
            }

            if (+res.statusCode >= 400) {
                return {
                    success: false,
                    message: res.message || "Không thể xoá phim yêu thích.",
                };
            }

            await refreshFavorites();

            return {
                success: true,
                isFavorite: false,
                message: res.message,
            };
        },
        [refreshFavorites]
    );

    return {
        favoriteMovies,
        favoriteMovieIds,
        isLoading: favoritesQuery.isLoading,
        isAuthenticated,
        isFavorite: (movieId: number) => favoriteMovieIds.has(movieId),
        toggleFavorite,
        removeFavorite,
        refreshFavorites,
    };
}
