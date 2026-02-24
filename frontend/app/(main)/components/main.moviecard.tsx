import { Movie } from '@/app/types/movie.type';



interface MovieCardProps {
    movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
    console.log("aaaa", movie)
    return (
        <div className="group cursor-pointer">

            <div className="relative overflow-hidden rounded-lg aspect-2/3">
                {/* Poster */}

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={movie.posterUrl}
                    alt={movie.title}

                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent
        opacity-0 group-hover:opacity-100 transition duration-300 z-10">

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm text-gray-200 line-clamp-2">
                            {movie.description}
                        </p>
                    </div>
                </div>

                {/* Badge */}
                <div className="absolute top-2 left-2 bg-red-600/90 text-white px-2 py-1 rounded text-xs font-bold z-20">
                    {movie.status === 'ONGOING' ? 'Đang phát' : 'Hoàn thành'}

                </div>
            </div>

            {/* Title */}
            <div className="mt-3">
                <h3 className="text-white font-semibold group-hover:text-red-600 transition line-clamp-1">
                    {movie.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{movie.publishYear}</p>
            </div>

        </div>
    );
}