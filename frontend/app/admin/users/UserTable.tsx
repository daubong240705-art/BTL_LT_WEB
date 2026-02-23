// import { User } from "@/app/types/type"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Film, Mail, Plus, Search, Shield, Trash2 } from "lucide-react";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { useState } from "react";
import { User } from "@/app/types/movie.type";
import UserDialog from "./UserDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../service/api/user.api";


export default function UserTable() {
    const { data: users, isLoading, isError, error } = useAdminUsers();
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (id: number) => userApi.deleteUser(id),

        onSuccess: () => {
            // toast.success("Xoá phim thành công");
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        // onError: () => {
        //     toast.error("Xoá thất bại");
        // },
    });
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trang quản lý người dùng</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng số: {users?.length} người dùng</p>
                </div>
                <Button
                    onClick={() => {
                        setMode("add");
                        setIsUserDialogOpen(true);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20">
                    <Plus className="w-5 h-5" />
                    <span>Thêm người dùng</span>
                </Button>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm người dùng"
                        className="w-full bg-gray-900 border-gray-700
                        text-white pl-12 pr-4 py-5 rounded-lg
                        focus-visible:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        hover:border-blue-500
                        hover:shadow-lg
                        hover:shadow-blue-500/50
                        transition-all " />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-900/50 text-left border-b border-gray-700">
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">ID</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Người dùng</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Email</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Vai trò</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Sửa/xoá</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-700">


                            {users?.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-700/30 transition-all group hover:-translate-y-1">
                                    <TableCell className="px-6 py-4 text-gray-500 font-mono">{user.id}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                width={48}
                                                height={64}
                                                className="w-12 h-16 object-cover rounded bg-gray-700 shadow-md"
                                            />
                                            <div>
                                                <div className="text-white font-bold group-hover:text-blue-500 transition-colors">
                                                    {user.fullName}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            {user.email}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-6 py-4x">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN'
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                                            }`}>
                                            <Shield className="w-3 h-3" />
                                            {user.role === 'ADMIN' ? 'Admin' : 'User'}
                                        </span>
                                    </TableCell>


                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                onClick={() => {
                                                    setMode("edit");
                                                    setIsUserDialogOpen(true);
                                                    setSelectedUser(user);
                                                }}
                                                className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg transition-colors border border-blue-600/20">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2 bg-blue-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors border border-red-600/20">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}


                        </TableBody>
                    </Table>

                    {isLoading && (

                        <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                            <Film className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Đang tải danh sách người dùng...</h3>
                        </div>

                    )}
                    {isError && (

                        <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                            <Film className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Đã xảy ra lỗi: {error.message}</h3>
                        </div>

                    )}
                    <UserDialog
                        open={isUserDialogOpen}
                        onOpenChange={setIsUserDialogOpen}
                        mode={mode}
                        initialData={selectedUser}
                    />
                    <ConfirmDialog
                        isOpen={!!userToDelete}
                        onClose={() => setUserToDelete(null)}
                        onConfirm={() => {
                            if (userToDelete) {
                                deleteMutation.mutate(userToDelete.id);
                            }
                        }}
                        title="Xác nhận xoá người dùng"
                        message="Hành động này không thể hoàn tác. Bạn có chắc muốn xoá người dùng này không?"
                    />
                </div>
            </div>
        </div >
    )

}