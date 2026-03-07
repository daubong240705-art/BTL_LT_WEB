"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"





import { LoginForm, loginSchema } from "@/lib/schema/auth.schema"
import { sendRequest } from "@/lib/api/wrapprer"

export default function LoginPage() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginForm) => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await sendRequest<IBackendRes<any>>({
            url: "http://localhost:8080/api/v1/auth/login",
            method: "POST",
            body: data,
            useCredentials: true
        })

        if (res?.data) {
            router.push("/")
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

            <div className="absolute inset-0 bg-black"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl p-8">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-red-600 p-3 rounded-full mb-4">
                            <Film className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Đăng Nhập
                        </h1>
                    </div>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        {/* Username */}
                        <div className="space-y-2">

                            <Label className="text-zinc-200">
                                Tên đăng nhập
                            </Label>

                            <Input
                                placeholder="Nhập tên đăng nhập"
                                className="bg-zinc-800 border-zinc-700 text-white"
                                {...register("username")}
                            />

                            {errors.username && (
                                <p className="text-red-500 text-sm">
                                    {errors.username.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}
                        <div className="space-y-2">

                            <Label className="text-zinc-200">
                                Mật khẩu
                            </Label>

                            <Input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className="bg-zinc-800 border-zinc-700 text-white"
                                {...register("password")}
                            />

                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
                        >
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </Button>

                    </form>

                </div>
            </div>
        </div>
    )
}
