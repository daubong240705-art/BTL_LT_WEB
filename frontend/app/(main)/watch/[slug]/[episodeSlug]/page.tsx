
import Comments from "@/app/(main)/components/Comment";
import { Top5Movies } from "@/app/(main)/components/TopMovie";
import { getMovieBySlug, getMovieEpisode } from "@/lib/api/main.api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import VideoPlayer from "@/app/(main)/components/video.player";
import { getCurrentUser } from "@/lib/getCurrentUser";




type Props = {
    params: Promise<{ slug: string; episodeSlug: string }>;

}



export default async function MovieDetailPage({ params }: Props) {
    const { slug: movieSlug, episodeSlug } = await params;

    const [initialUser, movieRes, episodesRes] = await Promise.all([
        getCurrentUser(),
        getMovieBySlug(movieSlug),
        getMovieEpisode(movieSlug),
    ]);

    const movie = movieRes.data!;
    const episodes = episodesRes.data?.result ?? [];

    const currentEpisode = episodes.find(ep => ep.slug === episodeSlug);
    return (
        <>
            <div className="min-h-screen bg-gray-900 pb-20">
                <div className="container mx-auto px-4 py-8">

                    {/* Nút Quay Lại */}
                    <Link
                        href={`/movie/${movie.slug}`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại chi tiết phim</span>
                    </Link>


                    <div className="w-full max-w-8xl mx-auto space-y-8">


                        {/* 2. THÔNG TIN & DANH SÁCH TẬP (Gom lại thành 2 cột nhỏ bên dưới Video) */}
                        <div className="grid grid-cols-3 gap-8">

                            {/* Cột trái: Thông tin tập phim */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* 1. MÀN HÌNH VIDEO (PLAYER) */}
                                <div className="max-w-5xl mx-auto">
                                    <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">

                                        <div className="aspect-video relative">

                                            {/* Video */}
                                            {currentEpisode?.videoUrl ? (
                                                <VideoPlayer src={currentEpisode.videoUrl} />
                                            ) : (
                                                <div className="text-gray-400">Tập phim chưa có video</div>
                                            )}

                                            {/* Overlay gradient */}

                                        </div>

                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                        <span className="text-red-500">{currentEpisode?.name}</span>

                                    </h1>
                                    <p className="text-gray-400 text-lg mb-4">
                                        Phim: <span className="text-white font-semibold">{movie.title}</span>
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {movie.description}
                                    </p>
                                </div>

                                {/* Phần Bình Luận */}
                                <Comments movieId={movie.id} initialUser={initialUser} />
                            </div>

                            {/* Cột phải: Danh sách tập (Để bên cạnh thông tin cho gọn) */}
                            <div className="lg:col-span-1 space-y-5">
                                <Top5Movies />
                                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-6">
                                    <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-red-600 pl-3">
                                        Danh sách tập
                                    </h2>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-2 max-h-100 overflow-y-auto custom-scrollbar pr-1">
                                        {episodes.map((ep) => (
                                            <Link
                                                key={ep.id}
                                                href={`/watch/${movie.slug}/${ep.slug}`}
                                                scroll={false}
                                                className="group bg-gray-800 hover:bg-red-600 text-white py-3 rounded-lg text-center font-semibold transition-all border border-gray-700 hover:border-red-500"
                                            >
                                                <span>{ep.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
