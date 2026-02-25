"use client";
import { useState } from "react";
import PageHeader from "../../components/admin.header";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import UserTable from "./UserTable";
import UserDialog from "./UserDialog";
import { User } from "@/app/types/movie.type";
import { useDeleteUser } from "../../hooks/user/useDeleteUser";


export type UserDialogState =
    | { type: "add" }
    | { type: "edit"; user: User }
    | null;

export default function UsersController({ users }: { users: User[] }) {
    const [dialog, setDialog] = useState<UserDialogState>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { deleteUser } = useDeleteUser();
    return (
        <>
            {/* HEADER */}
            <PageHeader
                title="người dùng"
                count={users.length}
                onAdd={() => setDialog({ type: "add" })}
            />

            {/* TABLE */}
            <UserTable
                users={users}
                onEdit={(m) => setDialog({ type: "edit", user: m })}
                onDelete={(m) => setUserToDelete(m)}
            />

            {/* UserDialog */}
            <UserDialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.user : undefined}
            />

            {/* ConfirmDialog  */}
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
                message="Hành động này không thể hoàn tác."
            />
        </>
    );
}