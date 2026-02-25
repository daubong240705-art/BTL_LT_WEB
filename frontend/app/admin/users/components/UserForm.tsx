
import { User } from "@/app/types/movie.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Mail, Save, User2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { UserFormValues, useUserForm, useUserMutation } from "../../hooks/user/useUserForm";


type Props = {
    mode: "add" | "edit";
    initialData?: User;
    onClose: () => void;
};

export default function UserForm({ mode, initialData, onClose }: Props) {
    const form = useUserForm(mode, initialData);
    const mutation = useUserMutation(mode, initialData?.id, onClose);
    const onSubmit = (data: UserFormValues) => {
        delete data.confirmPassword;
        mutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-8">
                {/* Avatar + Basic Info */}
                <div className="flex flex-row gap-8">

                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="group">
                            <div className="w-28 h-28 rounded-full overflow-hidden 
                        border border-gray-700 bg-gray-900
                        flex items-center justify-center
                        transition-all group-hover:border-blue-500
                        group-hover:shadow-lg
                        group-hover:shadow-blue-500/20">
                                <User2 className="w-12 h-12 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <span className="text-gray-400 text-sm mt-3">Ảnh đại diện</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Họ và tên
                        </label>
                        <Input
                            {...form.register("fullName")}
                            type="text"
                            placeholder="Nhập họ và tên"
                            required
                            className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            hover:border-blue-500
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            transition-all"
                        />

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-400">
                                Tên đăng nhập
                            </label>
                            <Input
                                {...form.register("username")}
                                type="text"
                                placeholder="username"
                                disabled={mode === "edit"}
                                className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            hover:border-blue-500
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            transition-all"
                            />
                        </div>

                    </div>
                </div>


                <div className="grid md:grid-cols-2 gap-6">


                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                {...form.register("email")}
                                type="email"
                                placeholder="email@example.com"
                                required
                                className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 pl-10 rounded-lg
                            focus-visible:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            hover:border-blue-500
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            transition-all"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">
                            Vai trò
                        </label>
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full bg-gray-800 border-gray-700
                                            text-white px-4 py-5 rounded-lg
                                            focus-visible:ring-0
                                            focus:border-blue-500
                                            hover:border-blue-500
                                            transition-all
                                            data-placeholder:text-gray-400
                                            data-placeholder:font-sm">
                                        <SelectValue
                                            placeholder="Vai trò" />
                                    </SelectTrigger>
                                    <SelectContent className=" bg-gray-800 border border-gray-700 text-white">
                                        <SelectItem value="ADMIN" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-blue-600 ">Quản trị viên</SelectItem>
                                        <SelectItem value="USER" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-blue-600">Người dùng</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                </div>

                {/* Password Section */}

                <div className="pt-6 border-t border-gray-800 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Thiết lập mật khẩu
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            {...form.register("password")}
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            hover:border-blue-500
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            transition-all"
                        />

                        <Input
                            {...form.register("confirmPassword")}
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            className="w-full bg-gray-800
                            border border-gray-700
                            text-white px-4 py-5 rounded-lg
                            focus-visible:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            hover:border-blue-500
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            transition-all"
                        />
                    </div>
                </div>

            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                <Button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Hủy bỏ
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>

            </div>
        </form>
    )
}