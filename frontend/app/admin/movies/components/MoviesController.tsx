"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDeleteMovie } from "@/app/hooks/movie/useMovieForm";
import { useAdminListNavigation } from "@/app/hooks/admin/useAdminListNavigation";
import { type AdminMovieListState } from "@/lib/filter/admin-list";
import AdminTablePagination from "../../components/admin-table-pagination";
import AdminTableToolbar from "../../components/admin-table-toolbar";
import PageHeader from "../../components/admin.header";
import MovieDialog from "./MovieDialog";
import MoviesTable from "./MovieTable";

type MovieDialogState =
    | { type: "add" }
    | { type: "edit"; movie: Movie }
    | null;

type MoviesControllerProps = {
    movies: Movie[];
    initialState: AdminMovieListState;
    totalPages: number;
    totalItems: number;
};

export default function MoviesController({
    movies,
    initialState,
    totalPages,
    totalItems,
}: MoviesControllerProps) {
    const [dialog, setDialog] = useState<MovieDialogState>(null);
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
    const { deleteMovie } = useDeleteMovie();
    const { state, buildHref, updateState } = useAdminListNavigation(initialState);

    return (
        <>
            <PageHeader
                title="phim"
                count={totalItems}
                onAdd={() => setDialog({ type: "add" })}
            />

            <AdminTableToolbar
                searchValue={state.q}
                onSearchChange={(value) => updateState({ q: value, page: 1 })}
                searchPlaceholder="Tim theo tên phim hoặc slug..."
                totalItems={totalItems}
                filteredItems={totalItems}
            >
                <Select
                    value={state.type || "ALL"}
                    onValueChange={(value) =>
                        updateState({
                            type: value === "ALL" ? "" : value,
                            page: 1,
                        })}
                >
                    <SelectTrigger className="w-full border-gray-700 bg-gray-900 text-white lg:w-45">
                        <SelectValue placeholder="Loai phim" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-900 text-gray-100">
                        <SelectItem value="ALL">Tất cả loại</SelectItem>
                        <SelectItem value="SINGLE">Phim lẻ</SelectItem>
                        <SelectItem value="SERIES">Phim bộ</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={state.status || "ALL"}
                    onValueChange={(value) =>
                        updateState({
                            status: value === "ALL" ? "" : value,
                            page: 1,
                        })}
                >
                    <SelectTrigger className="w-full border-gray-700 bg-gray-900 text-white lg:w-45">
                        <SelectValue placeholder="Trang thai" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-900 text-gray-100">
                        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                        <SelectItem value="ONGOING">Đang phát</SelectItem>
                        <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    </SelectContent>
                </Select>
            </AdminTableToolbar>

            <MoviesTable
                movies={movies}
                onEdit={(movie) => setDialog({ type: "edit", movie })}
                onDelete={(movie) => setMovieToDelete(movie)}
            />
            <AdminTablePagination
                currentPage={state.page}
                totalPages={totalPages}
                onPageChange={(page) => updateState({ page })}
                getPageHref={(page) => buildHref({ page })}
            />

            <MovieDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.movie : undefined}
            />

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
                message="Xoá phim này sẽ xoá luôn tất cả tập phim của phim. Bạn có chắc không?"
            />
        </>
    );
}
