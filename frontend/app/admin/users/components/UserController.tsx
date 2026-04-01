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
import { useDeleteUser } from "@/app/hooks/user/useUserForm";
import { useAdminListNavigation } from "@/app/hooks/admin/useAdminListNavigation";
import { type AdminUserListState } from "@/lib/filter/admin-list";
import AdminTablePagination from "../../components/admin-table-pagination";
import AdminTableToolbar from "../../components/admin-table-toolbar";
import PageHeader from "../../components/admin.header";
import UserDialog from "./UserDialog";
import UserTable from "./UserTable";

export type UserDialogState =
    | { type: "add" }
    | { type: "edit"; user: User }
    | null;

type UsersControllerProps = {
    users: User[];
    initialState: AdminUserListState;
    totalPages: number;
    totalItems: number;
};

export default function UsersController({
    users,
    initialState,
    totalPages,
    totalItems,
}: UsersControllerProps) {
    const [dialog, setDialog] = useState<UserDialogState>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { deleteUser } = useDeleteUser();
    const { state, buildHref, updateState } = useAdminListNavigation(initialState);

    return (
        <>
            <PageHeader
                title="người dùng"
                count={totalItems}
                onAdd={() => setDialog({ type: "add" })}
            />

            <AdminTableToolbar
                searchValue={state.q}
                onSearchChange={(value) => updateState({ q: value, page: 1 })}
                searchPlaceholder="Tim theo tên, username hoặc email..."
                totalItems={totalItems}
                filteredItems={totalItems}
            >
                <Select
                    value={state.role || "ALL"}
                    onValueChange={(value) =>
                        updateState({
                            role: value === "ALL" ? "" : value,
                            page: 1,
                        })}
                >
                    <SelectTrigger className="w-full border-gray-700 bg-gray-900 text-white lg:w-45">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-900 text-gray-100">
                        <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                </Select>
            </AdminTableToolbar>

            <UserTable
                users={users}
                onEdit={(user) => setDialog({ type: "edit", user })}
                onDelete={(user) => setUserToDelete(user)}
            />
            <AdminTablePagination
                currentPage={state.page}
                totalPages={totalPages}
                onPageChange={(page) => updateState({ page })}
                getPageHref={(page) => buildHref({ page })}
            />

            <UserDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.user : undefined}
            />

            <ConfirmDialog
                Open={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={() => {
                    if (!userToDelete) return;
                    deleteUser(userToDelete.id, {
                        onSuccess: () => setUserToDelete(null),
                    });
                }}
                title="Xoá người dùng?"
                message="Xoá người dùng này sẽ xoá luôn toàn bộ comment của họ. Bạn có chắc không?"
            />
        </>
    );
}
