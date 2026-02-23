import { User } from "@/app/types/movie.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";



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

export function useUserForm(
    mode: "add" | "edit",
    initialData?: User
) {
    const form = useForm({
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
