"use client";
import { Category } from "@/app/types/movie.type";
import { useState } from "react";
import PageHeader from "../../components/admin.header";
import CategoryTable from "./CategoryTable";
import CategoryDialog from "./CategoryDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteCategory } from "../../hooks/category/useDeleteCategory";

export type CategoryDialogState =
    | { type: "add" }
    | { type: "edit"; category: Category }
    | null;

export default function CategoriesController({ categories }: { categories: Category[] }) {
    const [dialog, setDialog] = useState<CategoryDialogState>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const { deleteMovie } = useDeleteCategory();
    return (
        <>
            {/* HEADER */}
            <PageHeader
                title="thể loại"
                count={categories.length}
                onAdd={() => setDialog({ type: "add" })}
            />

            {/* TABLE */}
            <CategoryTable
                categories={categories}
                onEdit={(m) => setDialog({ type: "edit", category: m })}
                onDelete={(m) => setCategoryToDelete(m)}
            />

            {/* MovieDialog */}
            <CategoryDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.category : undefined}
            />

            {/* ConfirmDialog  */}
            <ConfirmDialog
                Open={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={() => {
                    if (!categoryToDelete) return;
                    deleteMovie(categoryToDelete.id, {
                        onSuccess: () => setCategoryToDelete(null),
                    });
                }}
                title="Xoá thể loại?"
                message="Hành động này không thể hoàn tác."
            />
        </>
    );
}