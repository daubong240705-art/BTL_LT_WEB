"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "../../service/api/user.api";


export const useDeleteUser = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (id: number) => userApi.deleteUser(id),

        onSuccess: () => {
            router.refresh();
        },
    });

    return {
        deleteUser: mutation.mutate,
        isDeleting: mutation.isPending,
    };
};