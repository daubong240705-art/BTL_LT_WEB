import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Ten dang nhap phai co it nhat 3 ky tu"),

  password: z
    .string()
    .min(6, "Mat khau phai co it nhat 6 ky tu")
})

export type LoginForm = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    fullName: z.string().min(1, "Ho ten khong duoc de trong"),
    email: z.string().email("Email khong hop le"),
    username: z.string().min(3, "Ten dang nhap phai co it nhat 3 ky tu"),
    password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
    confirmPassword: z.string().min(6, "Xac nhan mat khau toi thieu 6 ky tu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mat khau xac nhan khong khop",
    path: ["confirmPassword"],
  })

export type SignupForm = z.infer<typeof signupSchema>
