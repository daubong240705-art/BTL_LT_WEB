"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Film } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendRequest } from "@/lib/api/wrapprer"
import { SignupForm, signupSchema } from "@/lib/schema/auth.schema"

type SignupPayload = Omit<SignupForm, "confirmPassword">

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setServerError("")

    const payload: SignupPayload = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      password: data.password,
    }

    const res = await sendRequest<IBackendRes<SignupPayload>>({
      url: "http://localhost:8080/api/v1/auth/signup",
      method: "POST",
      body: payload,
    })

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      router.push("/login")
      return
    }

    const errorText = Array.isArray(res?.error)
      ? res.error.join(", ")
      : (res?.error as string) || "Dang ky that bai"

    setServerError(errorText)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/70 to-black/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-600 p-3 rounded-full mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Dang ky</h1>
            <p className="text-zinc-400 text-sm">Tao tai khoan moi de bat dau</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-200">Ho va ten</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nhap ho va ten"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhap dia chi email"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-200">Ten dang nhap</Label>
              <Input
                id="username"
                type="text"
                placeholder="Chon ten dang nhap"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                {...register("username")}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Mat khau</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tao mat khau"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200">Xac nhan mat khau</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhap lai mat khau"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/20"
            >
              {isSubmitting ? "Dang xu ly..." : "Tao tai khoan"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Da co tai khoan?{" "}
              <Link href="/login" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
                Dang nhap ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
