import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),

  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
})

export type LoginForm = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Tên đăng nhập phải có í nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có í nhất 6 ký tự"),
    confirmPassword: z.string().min(6, ""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không chính xác",
    path: ["confirmPassword"],
  })

export type SignupForm = z.infer<typeof signupSchema>
