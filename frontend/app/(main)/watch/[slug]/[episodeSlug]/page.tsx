import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import Comments from "@/app/(main)/components/Comment";
import { Top5Movies } from "@/app/(main)/components/TopMovie";
import VideoPlayer from "@/app/(main)/components/video.player";
import { getMovieEpisode, increaseMovieView } from "@/lib/api/main.api";

type Props = {
    params: Promise<{ slug: string; episodeSlug: string }>;
};

export default async function MovieDetailPage({ params }: Props) {
    const { slug: movieSlug, episodeSlug } = await params;

    const movieRes = await increaseMovieView(movieSlug);
    const episodesRes = await getMovieEpisode(movieSlug);

    const movie = movieRes.data!;
    const episodes = episodesRes.data?.result ?? [];
    const currentEpisode = episodes.find((episode) => episode.slug === episodeSlug);

    return (
        <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
            <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <Link
                    href={`/movie/${movie.slug}`}
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white sm:text-base"
                >
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Quay lại chi tiết phim</span>
                </Link>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl">
                            <div className="relative aspect-video">
                                {currentEpisode?.videoUrl ? (
                                    <VideoPlayer src={currentEpisode.videoUrl} />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-6 text-center text-gray-400">
                                        Tap phim chua co video
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5 sm:p-6">
                            <h1 className="mb-2 break-words text-xl font-bold text-white sm:text-2xl [overflow-wrap:anywhere]">
                                <span className="text-red-500">
                                    {currentEpisode?.name ?? "Dang cap nhat"}
                                </span>
                            </h1>
                            <p className="mb-4 break-words text-base text-gray-400 sm:text-lg [overflow-wrap:anywhere]">
                                Phim: <span className="font-semibold text-white">{movie.title}</span>
                            </p>
                            <p className="break-words whitespace-pre-line text-sm leading-relaxed text-gray-300/85 sm:text-base [overflow-wrap:anywhere]">
                                {movie.description}
                            </p>
                        </div>

                        <Comments movieId={movie.id} />
                    </div>

                    <aside className="space-y-5 xl:col-span-1">
                        <Top5Movies />

                        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5 sm:p-6 xl:sticky xl:top-20">
                            <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-lg font-bold text-white">
                                Danh sách tập
                            </h2>

                            <div className="custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] grid max-h-[28rem] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-4">
                                {episodes.map((episode) => (
                                    <Link
                                        key={episode.id}
                                        href={`/watch/${movie.slug}/${episode.slug}`}
                                        scroll={false}
                                        className={`rounded-lg border py-3 text-center font-semibold transition-all ${episode.slug === episodeSlug
                                                ? "border-red-500 bg-red-600 text-white"
                                                : "border-gray-700 bg-gray-800 text-white hover:border-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        <span className="block break-words px-2 text-sm [overflow-wrap:anywhere]">
                                            {episode.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
