"use client";
import { useState } from "react";
import { Movie } from "@/app/types/movie.type";
import MoviesTable from "./MovieTable";
import MovieDialog from "./MovieDialog";
import PageHeader from "../../components/admin.header";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteMovie } from "../../hooks/movie/useDeleteMovie";


export type MovieDialogState =
    | { type: "add" }
    | { type: "edit"; movie: Movie }
    | null;

export default function MoviesController({ movies }: { movies: Movie[] }) {
    const [dialog, setDialog] = useState<MovieDialogState>(null);
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
    const { deleteMovie } = useDeleteMovie();
    return (
        <>
            {/* HEADER */}
            <PageHeader
                title="phim"
                count={movies.length}
                onAdd={() => setDialog({ type: "add" })}
            />

            {/* TABLE */}
            <MoviesTable
                movies={movies}
                onEdit={(m) => setDialog({ type: "edit", movie: m })}
                onDelete={(m) => setMovieToDelete(m)}
            />

            {/* MovieDialog */}
            <MovieDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.movie : undefined}
            />

            {/* ConfirmDialog  */}
            <ConfirmDialog
                Open={!!movieToDelete}
                onClose={() => setMovieToDelete(null)}
                onConfirm={() => {
                    if (!movieToDelete) return;
                    deleteMovie(movieToDelete.id, {
                        onSuccess: () => setMovieToDelete(null),
                    });
                }}
                title="Xoá phim?"
                message="Hành động này không thể hoàn tác."
            />
        </>
    );
}