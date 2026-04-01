import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle, Play } from "lucide-react";

import { getMovieBySlug, getMovieEpisode } from "@/lib/api/main.api";
import Comments from "../../components/Comment";
import { Top5Movies } from "../../components/TopMovie";
import { FavoriteToggle } from "../../components/favorite-toggle";

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function MovieDetailPage({ params }: Props) {
    const { slug: movieSlug } = await params;

    const [movieRes, episodesRes] = await Promise.all([
        getMovieBySlug(movieSlug),
        getMovieEpisode(movieSlug),
    ]);

    const movie = movieRes.data!;
    const episodes = episodesRes.data?.result ?? [];
    const firstEpisode = episodes.at(0) ?? null;

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="relative h-[42vh] overflow-hidden sm:h-[52vh] lg:h-[72vh]">
                <Image
                    src={movie.thumbUrl || movie.posterUrl}
                    alt={movie.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/90 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto -mt-24 w-full max-w-[1680px] px-4 pb-16 sm:-mt-32 sm:px-6 lg:-mt-48 lg:px-8 lg:pb-20 xl:-mt-56 2xl:px-10">
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
                    <aside className="rounded-3xl bg-gray-900/95 p-5 sm:p-7">
                        <div className="space-y-5">
                            <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-lg sm:w-40">
                                <Image
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    fill
                                    sizes="160px"
                                    quality={80}
                                    className="object-cover"
                                />
                            </div>

                            <h1 className="break-words text-2xl font-bold text-white sm:text-3xl [overflow-wrap:anywhere]">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800/50 px-3 py-1 text-gray-300">
                                    <Calendar className="h-4 w-4" />
                                    <span>{movie.publishYear}</span>
                                </div>

                                <div
                                    className={`flex items-center rounded-md px-3 py-1 text-sm font-bold ${movie.status === "ONGOING"
                                        ? "border border-green-600/30 bg-green-600/20 text-green-400"
                                        : "border border-blue-600/30 bg-blue-600/20 text-blue-400"
                                        }`}
                                >
                                    {movie.status === "ONGOING" ? "Đang phát" : "Hoàn thành"}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-gray-700"
                                    >
                                        {category.name}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Noi dung phim</h3>
                                <p className="break-words whitespace-pre-line text-base leading-relaxed text-gray-300/85 [overflow-wrap:anywhere]">
                                    {movie.description}
                                </p>
                            </div>

                            <Top5Movies />
                        </div>
                    </aside>

                    <main className="space-y-8 rounded-3xl bg-gray-900/95 p-5 sm:p-7 lg:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                            {firstEpisode ? (
                                <Link
                                    href={`/watch/${movie.slug}/${firstEpisode.slug}`}
                                    className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-green-400 to-green-500 px-6 py-3 font-bold text-black shadow-[0_0_20px_rgba(0,0,0,0.6)] shadow-green-500/50 transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] sm:px-8"
                                >
                                    <Play className="h-5 w-5 fill-current" />
                                    <span>Xem ngay</span>
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-full bg-gray-700 px-6 py-3 font-bold text-gray-400 sm:px-8"
                                >
                                    <span>Chua co tap</span>
                                </button>
                            )}

                            <FavoriteToggle
                                movie={movie}
                                className="px-5 py-3 font-semibold text-gray-300 hover:bg-gray-700/20"
                                iconClassName="h-5 w-5"
                            />

                            <a
                                href="#comments"
                                className="flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-gray-300 transition-all hover:bg-gray-700/20"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span>Bình luận</span>
                            </a>
                        </div>

                        <section className="pb-8 sm:pb-12">
                            <h3 className="mb-4 border-l-4 border-red-600 pl-3 text-xl font-bold text-white">
                                Danh sách tập
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
                                {episodes.map((episode) => (
                                    <Link
                                        key={episode.id}
                                        href={`/watch/${movie.slug}/${episode.slug}`}
                                        className="group rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-center font-semibold text-white transition-all hover:border-red-500 hover:bg-red-600"
                                    >
                                        <span className="block break-words text-sm [overflow-wrap:anywhere] sm:text-base">
                                            {episode.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <div id="comments" className="pt-[20vh]">
                            <Comments movieId={movie.id} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
