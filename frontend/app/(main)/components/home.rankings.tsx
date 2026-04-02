"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Play } from "lucide-react";

import { type PublicMovieRanking, type PublicMovieRankingSummary } from "@/lib/api/main.api";

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

type RankingMetric = "views" | "favorites" | "comments";

type HomeRankingsProps = {
    rankings?: PublicMovieRankingSummary | null;
};

type RankingTabConfig = {
    label: string;
    title: string;
    description: string;
    metricLabel: string;
    selectItems: (rankings: PublicMovieRankingSummary) => PublicMovieRanking[];
};

const emptyRankings: PublicMovieRankingSummary = {
    topViewedMovies: [],
    topFavoritedMovies: [],
    topCommentedMovies: [],
};

const rankingTabs: Record<RankingMetric, RankingTabConfig> = {
    views: {
        label: "Xem nhieu",
        title: "Xem nhieu nhat",
        description: "Cac phim dang dan dau ve luot xem.",
        metricLabel: "Luot xem",
        selectItems: (rankings) => rankings.topViewedMovies,
    },
    favorites: {
        label: "Yeu thich",
        title: "Yeu thich nhieu nhat",
        description: "Nhung phim duoc nguoi dung luu lai nhieu nhat.",
        metricLabel: "Yeu thich",
        selectItems: (rankings) => rankings.topFavoritedMovies,
    },
    comments: {
        label: "Comment",
        title: "Comment nhieu nhat",
        description: "Nhung phim dang co thao luan soi dong nhat.",
        metricLabel: "Binh luan",
        selectItems: (rankings) => rankings.topCommentedMovies,
    },
};

function RankingCard({
    movie,
    index,
    metricLabel,
    primaryValue,
}: {
    movie: PublicMovieRanking;
    index: number;
    metricLabel: string;
    primaryValue: number;
}) {
    return (
        <Link
            href={`/movie/${movie.slug}`}
            className="group flex min-w-0 items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-white/8 sm:items-center"
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-sm font-bold text-red-300 sm:h-9 sm:w-9">
                #{index + 1}
            </div>

            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-800 sm:h-16 sm:w-12">
                {movie.posterUrl ? (
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 40px, 48px"
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
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 sm:gap-x-3">
                    <span>Nam {movie.publishYear ?? "N/A"}</span>
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

            <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{metricLabel}</p>
                <p className="text-lg font-semibold text-white">{formatNumber(primaryValue)}</p>
            </div>
        </Link>
    );
}

export function HomeRankings({ rankings }: HomeRankingsProps) {
    const safeRankings = rankings ?? emptyRankings;
    const [activeTab, setActiveTab] = useState<RankingMetric>("views");

    const activeConfig = rankingTabs[activeTab];
    const activeItems = activeConfig.selectItems(safeRankings);

    return (
        <section className="overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="mb-6 border-l-4 border-red-600 pl-3 text-xl font-bold text-white sm:text-2xl">
                Bang xep hang
            </h2>

            <div className="rounded-3xl border border-white/10 bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 p-4 shadow-2xl shadow-black/20 sm:p-5">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white sm:text-xl">{activeConfig.title}</h3>
                        <p className="mt-1 text-sm text-gray-400">{activeConfig.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {(Object.entries(rankingTabs) as [RankingMetric, RankingTabConfig][]).map(([key, tab]) => {
                            const isActive = key === activeTab;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setActiveTab(key)}
                                    className={[
                                        "rounded-full border px-3 py-2 text-sm font-semibold transition",
                                        isActive
                                            ? "border-red-500 bg-red-500 text-white"
                                            : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {activeItems.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-gray-400">
                            Chua co du lieu xep hang.
                        </div>
                    ) : (
                        activeItems.map((movie, index) => {
                            const primaryValue =
                                activeTab === "views"
                                    ? movie.viewCount
                                    : activeTab === "favorites"
                                        ? movie.favoriteCount
                                        : movie.commentCount;

                            return (
                                <RankingCard
                                    key={`${activeTab}-${movie.id}`}
                                    movie={movie}
                                    index={index}
                                    metricLabel={activeConfig.metricLabel}
                                    primaryValue={primaryValue}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
