import { User } from "@/app/types/global.type";
import { AppInput } from "@/components/shared/AppInput";
import { FormError } from "@/components/shared/FormError";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Lock, Mail, Save, User2 } from "lucide-react";

import { UserFormValues, useUserForm, useUserMutation } from "../../hooks/user/useUserForm";
import { UserPayload } from "../../service/api/user.api";

type Props = {
    mode: "add" | "edit";
    initialData?: User;
    onClose: () => void;
};

export default function UserForm({ mode, initialData, onClose }: Props) {
    const form = useUserForm(mode, initialData);
    const mutation = useUserMutation(mode, form, initialData?.id, onClose);

    const onSubmit = (data: UserFormValues) => {
        form.clearErrors("root");

        const payload: UserPayload = {
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            role: data.role,
            password: data.password || undefined,
        };

        mutation.mutate(payload);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-8">
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col items-center">
                        <div className="group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-700 bg-gray-900 flex items-center justify-center transition-all group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                <User2 className="w-12 h-12 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                        <span className="text-gray-400 text-sm mt-3">Anh dai dien</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Ho va ten</label>
                            <AppInput
                                {...form.register("fullName")}
                                type="text"
                                color="blue"
                                placeholder="Nhap ho va ten"
                                className="text-white px-4 py-5"
                            />
                            <FormError message={form.formState.errors.fullName?.message} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">Ten dang nhap</label>
                            <AppInput
                                {...form.register("username")}
                                type="text"
                                color="blue"
                                placeholder="username"
                                disabled={mode === "edit"}
                                className="text-white px-4 py-5"
                            />
                            <FormError message={form.formState.errors.username?.message} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <AppInput
                                {...form.register("email")}
                                type="email"
                                color="blue"
                                placeholder="email@example.com"
                                className="text-white px-4 py-5 pl-10"
                            />
                        </div>
                        <FormError message={form.formState.errors.email?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Vai tro</label>
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white px-4 py-5 rounded-lg focus:border-blue-500 hover:border-blue-500/50 transition-all data-placeholder:text-gray-400 data-placeholder:font-sm">
                                        <SelectValue placeholder="Vai tro" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                                        <SelectItem value="ADMIN" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-blue-600">Quan tri vien</SelectItem>
                                        <SelectItem value="USER" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-blue-600">Nguoi dung</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormError message={form.formState.errors.role?.message} />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-800 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Thiet lap mat khau
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <AppInput
                                {...form.register("password")}
                                type="password"
                                color="blue"
                                placeholder="Mat khau"
                                className="text-white px-4 py-5"
                            />
                            <FormError message={form.formState.errors.password?.message} />
                        </div>
                        <div>
                            <AppInput
                                {...form.register("confirmPassword")}
                                type="password"
                                color="blue"
                                placeholder="Xac nhan mat khau"
                                className="text-white px-4 py-5"
                            />
                            <FormError message={form.formState.errors.confirmPassword?.message} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                <Button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Huy bo
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Dang luu..." : "Luu"}
                </Button>
            </div>

            <div className="px-6 pb-4">
                <FormError message={form.formState.errors.root?.message} />
            </div>
        </form>
    );
}
