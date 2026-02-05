"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import CreateMovieDialog from "../components/CreateMovieDialog";

export default function AdminMoviesPage() {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<"add" | "edit">("add");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trang quản lý phim</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng số: 2 phim</p>
                </div>
                <Button
                    onClick={() => {
                        setMode("add");
                        setOpen(true);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Thêm phim</span>
                </Button>
                <CreateMovieDialog
                    open={open}
                    onOpenChange={setOpen}
                    mode={mode}
                />
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm phim"
                        className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-900/50 text-left border-b border-gray-700">
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">ID</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Thông tin phim</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Thể loại</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Trạng thái</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-700">
                            <TableRow className="hover:bg-gray-700/30 transition-colors group">

                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>


    );
}
