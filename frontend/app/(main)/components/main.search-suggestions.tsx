"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SearchSuggestionsProps = {
    keyword: string;
    movies: Movie[];
    isLoading: boolean;
    open: boolean;
    isBannerOverlay: boolean;
    onSelect: () => void;
};

export default function SearchSuggestions({
    keyword,
    movies,
    isLoading,
    open,
    isBannerOverlay,
    onSelect,
}: SearchSuggestionsProps) {
    const trimmedKeyword = keyword.trim();

    if (!open || trimmedKeyword.length < 2) return null;


    return (
        <div
            className={cn(
                "absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md",
                isBannerOverlay
                    ? "border-white/10 bg-black/80"
                    : "border-slate-800 bg-slate-950/95"
            )}
        >
            <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-300">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tìm phim...</span>
                    </div>
                ) : movies.length > 0 ? (
                    movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/movie/${movie.slug}`}
                            onClick={onSelect}
                            className="flex items-center gap-3 border-b border-white/5 px-3 py-3 transition-colors hover:bg-white/6"
                        >
                            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800">
                                <Image
                                    src={movie.posterUrl || movie.thumbUrl}
                                    alt={movie.title}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="line-clamp-1 text-sm font-semibold text-white">
                                    {movie.title}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                    <span>{movie.publishYear}</span>
                                    <span className="h-1 w-1 rounded-full bg-gray-600" />
                                    <span>{movie.status === "ONGOING" ? "Đang phát" : "Hoàn thành"}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="px-4 py-4 text-sm text-gray-400">
                        Không tìm thấy phim phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
}
