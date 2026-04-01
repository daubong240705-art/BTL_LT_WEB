import { Edit, Trash2 } from "lucide-react";

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
    movies: Movie[];
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

export default function MoviesTable({ movies, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-xl">
            <div className="overflow-x-auto">
                <Table className="min-w-[720px] w-full">
                    <TableHeader>
                        <TableRow className="border-b border-gray-700 bg-gray-900/50 text-left">
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                ID
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Thông tin phim
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Thể loại
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Trạng thái
                            </TableHead>
                            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                                Sửa/xoá
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-700">
                        {movies?.map((movie) => (
                            <TableRow
                                key={movie.id}
                                className="group transition-all hover:-translate-y-1 hover:bg-gray-700/30"
                            >
                                <TableCell className="px-4 py-4 align-top font-mono text-gray-500">
                                    {movie.id}
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex items-start gap-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            width={48}
                                            height={64}
                                            className="h-16 w-12 shrink-0 rounded bg-gray-700 object-cover shadow-md"
                                        />

                                        <div className="min-w-0">
                                            <div className="break-words font-bold text-white transition-colors group-hover:text-red-500 [overflow-wrap:anywhere]">
                                                {movie.title}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {movie.publishYear}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex flex-wrap gap-1.5">
                                        {movie.categories.slice(0, 2).map((category) => (
                                            <span
                                                key={category.id}
                                                className="rounded border border-gray-600 bg-gray-700 px-2 py-0.5 text-xs text-gray-300 break-words [overflow-wrap:anywhere]"
                                            >
                                                {category.name}
                                            </span>
                                        ))}

                                        {movie.categories.length > 2 && (
                                            <span className="rounded border border-gray-600 bg-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
                                                +{movie.categories.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                                            movie.status === "ONGOING"
                                                ? "border-green-500/20 bg-green-500/10 text-green-500"
                                                : "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                        }`}
                                    >
                                        {movie.status === "ONGOING" ? "Dang phat" : "Hoan thanh"}
                                    </span>
                                </TableCell>

                                <TableCell className="px-4 py-4 align-top">
                                    <div className="flex items-center gap-2 opacity-100 transition-all sm:opacity-0 sm:group-hover:opacity-100">
                                        <Button
                                            onClick={() => onEdit(movie)}
                                            className="rounded-lg border border-blue-600/20 bg-blue-600/10 p-2 text-blue-500 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(movie)}
                                            className="rounded-lg border border-red-600/20 bg-red-600/10 p-2 text-red-500 hover:bg-red-600 hover:text-white"
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
