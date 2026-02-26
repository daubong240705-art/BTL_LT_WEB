
import { Calendar, Heart, MessageCircle, Play } from "lucide-react";
import { getMovieBySlug } from "../../service/main.api";
import Link from "next/link";


type Props = {
    params: Promise<{ slug: string }>;

}
export default async function MovieDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const movieSlug = resolvedParams.slug;
    const movie = await getMovieBySlug(movieSlug);
    console.log(movie)
    return (
        <>
            <div className="min-h-screen bg-gray-900">

                <div className="relative h-[80vh] overflow-hidden">
                    <div
                        className="absolute inset-0  bg-cover bg-center"
                        style={{ backgroundImage: `url(${movie.thumbUrl})` }}
                    >
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/90 to-transparent" />
                    </div>

                </div>
                <div className="container  mx-auto px-4 -mt-70 pb-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3">

                        <div className="lg:col-span-1 bg-gray-900 rounded-4xl p-7">
                            <div className="space-y-5">
                                <div className=" overflow-hidden ">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-40 object-cover rounded-lg"
                                    />
                                </div>

                                <h1 className="text-3xl font-bold text-white">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1 rounded-md border border-gray-700">
                                        <Calendar className="w-4 h-4" />
                                        <span>{movie.publishYear}</span>
                                    </div>

                                    <div className={`px-3 py-1 rounded-md text-sm font-bold flex items-center ${movie.status === 'ONGOING'
                                        ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                        : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                        }`}>
                                        {movie.status === 'ONGOING' ? 'Đang phát' : 'Hoàn thành'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        {movie.categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors border border-gray-700"
                                            >
                                                {cat.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-white ">Nội dung phim</h3>
                                    <p className="text-gray-500 leading-relaxed text-lg">
                                        {movie.description}
                                    </p>
                                </div>


                            </div>
                        </div>

                        <div className="lg:col-span-2 pt-10 space-y-10  bg-gray-900 rounded-4xl p-7">
                            <div className="flex flex-wrap items-center gap-3">

                                <Link
                                    href={`http://localhost:3000/watch/${movie.slug}`}
                                    className="group relative flex items-center gap-3 bg-linear-to-r
                                    from-green-400 to-green-500
                                    text-black px-8 py-3
                                    rounded-full font-bold
                                    transition-all
                                    shadow-[0_0_20px_rgba(0,0,0,0.6)]
                                    shadow-green-500/50
                                    hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] ">
                                    <Play className="w-5 h-5 fill-current" />
                                    <span>Xem Ngay</span>
                                </Link>


                                <button className="flex-col flex items-center  hover:bg-gray-700/20 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all">
                                    <Heart className="w-5 h-5" />
                                    <span className="hidden sm:inline">Yêu thích</span>
                                </button>


                                {/* Comments */}
                                <button className="flex-col flex items-center hover:bg-gray-700/20 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="hidden sm:inline">Bình luận</span>
                                </button>


                            </div>
                            {/* Episodes */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-red-600 pl-3">Danh sách tập</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                    {/* {movie.episodes.map((ep) => (
                                        <Link
                                            key={ep.id}
                                            href={`/watch/${movie.id}?ep=${ep.number}`}
                                            className="group bg-gray-800 hover:bg-red-600 text-white py-3 rounded-lg text-center font-semibold transition-all border border-gray-700 hover:border-red-500"
                                        >
                                            <span className="text-xs text-gray-400 block group-hover:text-white/80">Tập</span>
                                            <span className="text-lg">{ep.number}</span>
                                        </Link>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}