"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import MovieDialog from "./MovieDialog";
import { Category, Movie } from "@/app/types/type";


type Props = {
    movies: Movie[];
    categories: Category[];
    isLoading: boolean;
};

export default function MoviesTable({ movies, categories, isLoading }: Props) {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trang quản lý phim</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng số: {movies.length} phim</p>
                </div>
                <Button
                    onClick={() => {
                        setMode("add");
                        setOpen(true);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20">
                    <Plus className="w-5 h-5" />
                    <span>Thêm phim</span>
                </Button>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm phim"
                        className="w-full bg-gray-900 border-gray-700
                        text-white pl-12 pr-4 py-5 rounded-lg
                        focus-visible:ring-0
                        focus:border-red-500
                        hover:border-red-500
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
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Thông tin phim</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Thể loại</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Trạng thái</TableHead>
                                <TableHead className="px-6 py-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">Sửa/xoá</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-700">


                            {isLoading && (
                                <TableRow className="hover:bg-gray-700/30 transition-colors group">
                                    <TableCell colSpan={4} className="px-6 py-4 text-gray-400">
                                        Đang tải phim...
                                    </TableCell>
                                </TableRow>
                            )}

                            {movies.map((movie) => (
                                <TableRow key={movie.id} className="hover:bg-gray-700/30 transition-all group hover:-translate-y-1">
                                    <TableCell className="px-6 py-4 text-gray-500 font-mono">{movie.id}</TableCell>
                                    <TableCell className="px-6 py-4x">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={movie.poster_url}
                                                alt={movie.title}
                                                width={48}
                                                height={64}
                                                className="w-12 h-16 object-cover rounded bg-gray-700 shadow-md"
                                            />

                                            <div>
                                                <div className="text-white font-bold group-hover:text-red-500 transition-colors">
                                                    {movie.title}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {movie.publish_year}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-6 py-4x">
                                        <div className="flex flex-wrap gap-1.5">
                                            {movie.category_ids.slice(0, 2).map((id) => {
                                                const categoryName = categories.find(c => c.id === id)?.name || id;
                                                return (
                                                    <span key={categoryName} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-600">
                                                        {categoryName}
                                                    </span>);
                                            })}
                                            {movie.category_ids.length > 2 && (
                                                <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-600">
                                                    +{movie.category_ids.length - 2}
                                                </span>
                                            )} </div>
                                    </TableCell>

                                    <TableCell className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${movie.status === 'ongoing'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {movie.status === 'ongoing' ? 'Đang phát' : 'Hoàn thành'}
                                        </span>
                                    </TableCell>


                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                onClick={() => {
                                                    setMode("edit");
                                                    setOpen(true);
                                                    setSelectedMovie(movie);

                                                }}
                                                className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg transition-colors border border-blue-600/20">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors border border-red-600/20">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}


                        </TableBody>
                    </Table>
                    <MovieDialog
                        open={open}
                        onOpenChange={setOpen}
                        mode={mode}
                        initialData={selectedMovie}
                    />
                </div>
            </div>
        </div >


    );
}
