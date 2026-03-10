"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { assertApiSuccess, handleFormError } from "../_shared/mutation.utils";
import { userApi } from "../../service/api/user.api";
import { UserPayload, userSchema, UserSubmitValues } from "@/app/types/form.type";
import { toast } from "sonner";


export function useUserForm(
    mode: "add" | "edit",
    initialData?: User
) {
    const form = useForm<UserSubmitValues>({
        resolver: zodResolver(userSchema),
        values: mode === "edit" && initialData
            ? {
                fullName: initialData.fullName,
                username: initialData.username,
                email: initialData.email,
                role: initialData.role,
                password: "",
                confirmPassword: "",
            }
            : {
                fullName: "",
                username: "",
                email: "",
                role: "USER",
                password: "",
                confirmPassword: "",
            }
    });
    return form;
}

export const useUserMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<UserSubmitValues>,
    userId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation<IBackendRes<User>, IBackendRes<null>, UserPayload>({
        mutationFn: async (data: UserPayload) => {
            const response = await (mode === "add"
                ? userApi.createUser(data)
                : userApi.updateUser(userId!, data));
            return assertApiSuccess(response);
        },
        onSuccess: (res) => {
            router.refresh();
            const userName = res.data?.username || "người dùng";
            toast.success(
                mode === "add" ? `Tạo ${userName} thành công!` : `Cập nhật ${userName} thành công!`
            );
            onClose?.();
        },
        onError: (err) => {
            handleFormError(err, form.setError);
        }
    });
};
