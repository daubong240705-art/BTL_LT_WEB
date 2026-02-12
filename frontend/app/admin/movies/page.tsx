"use client"

import { fetchMovies } from "@/lib/api/movie";
import MoviesTable from "./MovieTable";
import { useQuery } from "@tanstack/react-query";



export default function AdminMoviesPage() {
    const { data: movies = [], isLoading } = useQuery({
        queryKey: ["movies"],
        queryFn: fetchMovies,
    });

    return (
        <MoviesTable movies={movies} isLoading={isLoading} />
    );
}
