import { Edit, Mail, Shield, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Props {
    users: User[];
    onEdit: (movie: User) => void;
    onDelete: (movie: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-xl">
            <div className="overflow-x-auto">
                <Table className="min-w-[760px] w-full">
                    <TableHeader>
                        <TableRow className="border-b border-gray-700 bg-gray-900/50 text-left">
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                ID
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Người dùng
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Email
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Vai trò
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Sửa/xoá
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-700">
                        {users?.map((user) => (
                            <TableRow
                                key={user.id}
                                className="group transition-all hover:-translate-y-1 hover:bg-gray-700/30"
                            >
                                <TableCell className="px-4 py-4 align-top font-mono text-gray-500">
                                    {user.id}
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex items-start gap-4">
                                        {user.avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                width={48}
                                                height={64}
                                                className="h-16 w-12 shrink-0 rounded bg-gray-700 object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-gray-700 text-xs font-semibold text-gray-300 shadow-md">
                                                {user.username.slice(0, 1).toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <div className="break-words font-bold text-white transition-colors group-hover:text-blue-500 [overflow-wrap:anywhere]">
                                                {user.fullName}
                                            </div>
                                            <div className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                                                {user.username}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex items-start gap-2 text-sm text-gray-300">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                                        <span className="break-words [overflow-wrap:anywhere]">
                                            {user.email}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${user.role === "ADMIN"
                                                ? "border border-purple-500/20 bg-purple-500/10 text-purple-400"
                                                : "border border-green-500/20 bg-green-500/10 text-green-500"
                                            }`}
                                    >
                                        <Shield className="h-3 w-3" />
                                        {user.role === "ADMIN" ? "Admin" : "User"}
                                    </span>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                        <Button
                                            onClick={() => onEdit(user)}
                                            className="rounded-lg border border-blue-600/20 bg-blue-600/10 p-2 text-blue-500 transition-colors hover:bg-blue-600 hover:text-white"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(user)}
                                            className="rounded-lg border border-red-600/20 bg-red-600/10 p-2 text-red-500 transition-colors hover:bg-red-600 hover:text-white"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
