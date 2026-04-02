import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Play } from "lucide-react";

import { type PublicMovieRanking, type PublicMovieRankingSummary } from "@/lib/api/main.api";

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

type RankingMetric = "views" | "favorites" | "comments";

type RankingPanelProps = {
    title: string;
    description: string;
    items: PublicMovieRanking[];
    primaryMetric: RankingMetric;
};

const emptyRankings: PublicMovieRankingSummary = {
    topViewedMovies: [],
    topFavoritedMovies: [],
    topCommentedMovies: [],
};

function RankingPanel({ title, description, items, primaryMetric }: RankingPanelProps) {
    const getPrimaryValue = (movie: PublicMovieRanking) => {
        if (primaryMetric === "views") return movie.viewCount;
        if (primaryMetric === "favorites") return movie.favoriteCount;

        return movie.commentCount;
    };

    const getPrimaryLabel = () => {
        if (primaryMetric === "views") return "Lượt xem";
        if (primaryMetric === "favorites") return "Yêu thích";

        return "Bình luận";
    };

    return (
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 p-5 shadow-2xl shadow-black/20">
            <div className="mb-5">
                <h2 className="mt-2 text-xl font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-gray-400">
                        Chưa có dữ liệu xếp hạng.
                    </div>
                ) : (
                    items.map((movie, index) => (
                        <Link
                            key={`${primaryMetric}-${movie.id}`}
                            href={`/movie/${movie.slug}`}
                            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-white/8"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-sm font-bold text-red-300">
                                #{index + 1}
                            </div>

                            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                                {movie.posterUrl ? (
                                    <Image
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        fill
                                        sizes="48px"
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-lg font-semibold text-white">
                                        {movie.title.slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-white group-hover:text-red-300">
                                    {movie.title}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                    <span>Năm {movie.publishYear ?? "N/A"}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Play className="h-3.5 w-3.5" />
                                        {formatNumber(movie.viewCount)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Heart className="h-3.5 w-3.5" />
                                        {formatNumber(movie.favoriteCount)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        {formatNumber(movie.commentCount)}
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">{getPrimaryLabel()}</p>
                                <p className="text-lg font-semibold text-white">{formatNumber(getPrimaryValue(movie))}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}

type HomeRankingsProps = {
    rankings?: PublicMovieRankingSummary | null;
};

export function HomeRankings({ rankings }: HomeRankingsProps) {
    const safeRankings = rankings ?? emptyRankings;

    return (
        <section className="px-4 py-8 sm:px-6 lg:px-8">

            <h2 className="mb-6 border-l-4 border-red-600 pl-3 text-xl font-bold text-white sm:text-2xl">
                Bảng xếp hạng
            </h2>
            <div className="grid gap-6 xl:grid-cols-3">
                <RankingPanel
                    title="Xem nhiều nhất"
                    description="Các phim đang dẫn đầu về lượt xem."
                    items={safeRankings.topViewedMovies}
                    primaryMetric="views"
                />

                <RankingPanel
                    title="Yêu thích nhiều nhất"
                    description="Những phim được người dùng lưu lại nhiều nhất."
                    items={safeRankings.topFavoritedMovies}
                    primaryMetric="favorites"
                />

                <RankingPanel
                    title="Comment nhiều nhất"
                    description="Những phim đang có thảo luận sôi động nhất."
                    items={safeRankings.topCommentedMovies}
                    primaryMetric="comments"
                />
            </div>
        </section>
    );
}
