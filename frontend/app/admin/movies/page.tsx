"use client"
import { fetchMovies } from "@/lib/api/movie";
import MoviesTable from "./MovieTable";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/category";

export default function AdminMoviesPage() {
    const { data: movies = [], isLoading } = useQuery({
        queryKey: ["movies"],
        queryFn: fetchMovies,
    });
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    return (
        <MoviesTable movies={movies} categories={categories} isLoading={isLoading} />
    );
}
