"use client";

import { useDeleteWithRefresh } from "../_shared/mutation.utils";
import { userApi } from "../../service/api/user.api";

export const useDeleteUser = () => {
    const mutation = useDeleteWithRefresh(userApi.deleteUser, "Xoa nguoi dung thanh cong");

    return {
        deleteUser: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};
