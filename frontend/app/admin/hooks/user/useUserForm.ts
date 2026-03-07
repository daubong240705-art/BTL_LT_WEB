import { User } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UserPayload, userApi } from "../../service/api/user.api";

type ApiFailure = {
    statusCode?: number | string;
    error?: unknown;
};


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
            const res = await (mode === "add"
                ? userApi.createUser(data)
                : userApi.updateUser(userId!, data));

            const apiRes = res as ApiFailure;
            const statusCode = Number(apiRes.statusCode ?? 200);
            if (statusCode >= 400 || apiRes.error) {
                throw res;
            }
            return res;
        },
        onSuccess: () => {
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            const serverError = (error as ApiFailure)?.error;

            if (serverError && typeof serverError === "object" && !Array.isArray(serverError)) {
                for (const [key, value] of Object.entries(serverError)) {
                    if (key === "email") {
                        form.setError("email", { type: "server", message: String(value) });
                    } else if (key === "username") {
                        form.setError("username", { type: "server", message: String(value) });
                    } else {
                        form.setError("root", { type: "server", message: String(value) });
                    }
                }
                return;
            }

            const message = typeof serverError === "string" ? serverError : "Khong the luu nguoi dung";
            if (/email/i.test(message)) {
                form.setError("email", { type: "server", message });
                return;
            }
            if (/username/i.test(message)) {
                form.setError("username", { type: "server", message });
                return;
            }

            form.setError("root", { type: "server", message });
        }
    });
};
