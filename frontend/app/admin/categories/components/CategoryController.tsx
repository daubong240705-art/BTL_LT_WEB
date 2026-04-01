"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteCategory } from "@/app/hooks/category/useCategoryForm";
import { useAdminListNavigation } from "@/app/hooks/admin/useAdminListNavigation";
import { type AdminCategoryListState } from "@/lib/filter/admin-list";
import AdminTablePagination from "../../components/admin-table-pagination";
import AdminTableToolbar from "../../components/admin-table-toolbar";
import PageHeader from "../../components/admin.header";
import CategoryDialog from "./CategoryDialog";
import CategoryTable from "./CategoryTable";

export type CategoryDialogState =
    | { type: "add" }
    | { type: "edit"; category: Category }
    | null;

type CategoriesControllerProps = {
    categories: Category[];
    initialState: AdminCategoryListState;
    totalPages: number;
    totalItems: number;
};

export default function CategoriesController({
    categories,
    initialState,
    totalPages,
    totalItems,
}: CategoriesControllerProps) {
    const [dialog, setDialog] = useState<CategoryDialogState>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const { deleteCategory } = useDeleteCategory();
    const { state, buildHref, updateState } = useAdminListNavigation(initialState);

    return (
        <>
            <PageHeader
                title="the loai"
                count={totalItems}
                onAdd={() => setDialog({ type: "add" })}
            />

            <AdminTableToolbar
                searchValue={state.q}
                onSearchChange={(value) => updateState({ q: value, page: 1 })}
                searchPlaceholder="Tim theo ten the loai hoac slug..."
                totalItems={totalItems}
                filteredItems={totalItems}
            />

            <CategoryTable
                categories={categories}
                onEdit={(category) => setDialog({ type: "edit", category })}
                onDelete={(category) => setCategoryToDelete(category)}
            />
            <AdminTablePagination
                currentPage={state.page}
                totalPages={totalPages}
                onPageChange={(page) => updateState({ page })}
                getPageHref={(page) => buildHref({ page })}
            />

            <CategoryDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.category : undefined}
            />

            <ConfirmDialog
                Open={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={() => {
                    if (!categoryToDelete) return;
                    deleteCategory(categoryToDelete.id, {
                        onSuccess: () => setCategoryToDelete(null),
                    });
                }}
                title="Xoa the loai?"
                message="Xoa the loai nay se go no khoi cac phim dang su dung. Ban co chac khong?"
            />
        </>
    );
}
