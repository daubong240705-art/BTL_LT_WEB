"use client";

import { User } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { applyFormMutationError, assertApiSuccess } from "../_shared/mutation.utils";
import { UserPayload, userApi } from "../../service/api/user.api";


const userSchema = z
    .object({
        fullName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
        username: z.string().min(3, "Username tối thiểu 3 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        role: z.enum(["ADMIN", "USER"]),

        password: z
            .string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .optional()
            .or(z.literal("")),

        confirmPassword: z
            .string()
            .optional()
            .or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        if (data.password && data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Mật khẩu không khớp",
            });
        }
    });



export type UserFormValues = z.infer<typeof userSchema>;
export type UserSubmitValues = UserPayload & { confirmPassword?: string };

export function useUserForm(
    mode: "add" | "edit",
    initialData?: User
) {
    const form = useForm<UserSubmitValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            role: "USER",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.reset({
                fullName: initialData.fullName,
                username: initialData.username,
                email: initialData.email,
                role: initialData.role,
                password: "",
                confirmPassword: "",
            });
        }
    }, [mode, initialData, form]);

    return form;
}

export const useUserMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<UserSubmitValues>,
    userId?: number,
    onClose?: () => void
) => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: UserPayload) => {
            const response = await (mode === "add"
                ? userApi.createUser(data)
                : userApi.updateUser(userId!, data));
            return assertApiSuccess(response);
        },
        onSuccess: () => {
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            applyFormMutationError(form, error, {
                fallbackMessage: "Khong the luu nguoi dung",
                fieldMap: {
                    email: "email",
                    username: "username",
                },
                messageRules: [
                    { pattern: /email/i, field: "email" },
                    { pattern: /username/i, field: "username" },
                ],
            });
        }
    });
};
