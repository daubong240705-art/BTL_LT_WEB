"use client";

import Link from "next/link";
import { Film } from "lucide-react";

import { useSignupForm, useSignupMutation } from "@/app/hooks/auth/useSignupForm";
import { AppInput } from "@/components/shared/AppInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const form = useSignupForm();
  const signupMutation = useSignupMutation(form);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12 bg-black">
      <div className="relative z-10 w-full max-w-md px-6 ">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-600 p-3 rounded-full mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Dang ky</h1>
            <p className="text-zinc-400 text-sm">Tao tai khoan moi</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
          >
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-200">Ho va ten</Label>
              <AppInput
                id="fullName"
                type="text"
                placeholder="Nhap ho va ten"
                color="red"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 "
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Email</Label>
              <AppInput
                id="email"
                type="email"
                placeholder="Nhap email"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 "
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-200">Ten dang nhap</Label>
              <AppInput
                id="username"
                type="text"
                placeholder="Nhap ten dang nhap"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 "
                {...register("username")}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Mat khau</Label>
              <AppInput
                id="password"
                type="password"
                placeholder="Nhap mat khau"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 "
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200">Xac nhan mat khau</Label>
              <AppInput
                id="confirmPassword"
                type="password"
                placeholder="Nhap lai mat khau"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 "
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/20"
            >
              {signupMutation.isPending ? "Dang xu ly..." : "Tao tai khoan"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Da co tai khoan?{" "}
              <Link href="/login" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
                Dang nhap
              </Link>
            </p>
          </div>

          <div className="w-full h-4 mt-6 flex items-center justify-center border-zinc-700 bg-transparent border text-zinc-300 hover:bg-zinc-800 hover:text-white py-6 rounded-lg transition-all">
            <Link href="/">Tiep tuc voi tu cach khach</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
