// import { User } from "@/app/types/type"
import { User } from "@/app/types/movie.type";
import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Mail, Shield, Trash2 } from "lucide-react";

interface Props {
    users: User[];
    onEdit: (movie: User) => void;
    onDelete: (movie: User) => void;
}


export default function UserTable({ users, onEdit, onDelete }: Props) {
    return (
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
                                            onClick={() => onEdit(user)}
                                            className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg transition-colors border border-blue-600/20">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(user)}
                                            className="p-2 bg-blue-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors border border-red-600/20">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}


                    </TableBody>
                </Table>

            </div>
        </div>

    )

}