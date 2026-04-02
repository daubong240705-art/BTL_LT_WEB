import Image from "next/image";
import { Film, Heart, MessageCircle, Play, User } from "lucide-react";

import { getDashboardSummary, type DashboardMovieRanking, type DashboardSummary } from "@/lib/api/admin.api";

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const emptySummary: DashboardSummary = {
    totalMovies: 0,
    totalUsers: 0,
    totalViews: 0,
    topViewedMovies: [],
    topFavoritedMovies: [],
    topCommentedMovies: [],
};

type LeaderboardSectionProps = {
    title: string;
    description: string;
    items: DashboardMovieRanking[];
    primaryMetric: "views" | "favorites" | "comments";
};

function LeaderboardSection({
    title,
    description,
    items,
    primaryMetric,
}: LeaderboardSectionProps) {
    return (
        <section className="rounded-2xl border border-white/10 bg-gray-800/80 p-6 shadow-lg shadow-black/10">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{description}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-gray-900/70 px-3 py-1 text-xs font-medium text-gray-300">
                    Top {items.length || 5}
                </div>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/40 px-4 py-8 text-center text-sm text-gray-400">
                        Chưa có dữ liệu để hiển thị.
                    </div>
                ) : (
                    items.map((movie, index) => {
                        const primaryValue = primaryMetric === "views"
                            ? movie.viewCount
                            : primaryMetric === "favorites"
                                ? movie.favoriteCount
                                : movie.commentCount;
                        const primaryLabel = primaryMetric === "views"
                            ? "Lượt xem"
                            : primaryMetric === "favorites"
                                ? "Yêu thích"
                                : "Bình luận";

                        return (
                            <div
                                key={`${primaryMetric}-${movie.id}`}
                                className="flex items-center gap-4 rounded-xl border border-white/10 bg-gray-900/60 p-3 transition-colors hover:border-white/15 hover:bg-gray-900/80"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white">
                                    #{index + 1}
                                </div>

                                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-700">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-lg font-semibold text-white">
                                            {movie.title.slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
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
                                    <p className="text-xs uppercase tracking-wide text-gray-500">{primaryLabel}</p>
                                    <p className="text-lg font-semibold text-white">{formatNumber(primaryValue)}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}

export default async function AdminPage() {
    const summaryResponse = await getDashboardSummary();
    const summary = summaryResponse.data ?? emptySummary;

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 p-6">
                <h2 className="mb-4 text-xl font-semibold text-white">Trang quản trị</h2>
                <p className="text-gray-400">Chào mừng bạn đến với trang quản trị hệ thống.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-linear-to-br from-blue-600 to-blue-700 p-6 text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-3">
                            <Film className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold">{formatNumber(summary.totalMovies)}</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số phim</h3>
                </div>

                <div className="rounded-lg bg-linear-to-br from-green-600 to-green-700 p-6 text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-3">
                            <User className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold">{formatNumber(summary.totalUsers)}</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số người dùng</h3>
                </div>

                <div className="rounded-lg bg-linear-to-br from-purple-600 to-purple-700 p-6 text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-3">
                            <Play className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold">{formatNumber(summary.totalViews)}</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số lượt xem</h3>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div>
                    <LeaderboardSection
                        title="Phim được xem nhiều nhất"
                        description="Những bộ phim đang thu hút nhiều lượt xem nhất trên hệ thống."
                        items={summary.topViewedMovies}
                        primaryMetric="views"
                    />
                </div>

                <div>
                    <LeaderboardSection
                        title="Phim được yêu thích nhiều nhất"
                        description="Các phim được người dùng thêm vào danh sách yêu thích nhiều nhất."
                        items={summary.topFavoritedMovies}
                        primaryMetric="favorites"
                    /></div>



            </div>
            <div><LeaderboardSection
                title="Phim nhiều comment nhất"
                description="Các phim đang có lượng bình luận nhiều nhất từ người dùng."
                items={summary.topCommentedMovies}
                primaryMetric="comments"
            /></div>
        </div>
    );
}
