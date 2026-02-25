import { Movie } from "@/app/types/movie.type"
import { Button } from "@/components/ui/button"
import { Heart, Info, Play } from "lucide-react"


type Props = {
    MovieBanner: Movie
}
export default function HeroBanner({ MovieBanner }: Props) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute bg-cover inset-0 bg-center"
                style={{ backgroundImage: `url(${MovieBanner.thumbUrl})` }}>
                <div className="absolute left-0 top-0 h-full w-[60%] bg-linear-to-r from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[35%] bg-linear-to-t from-black via-black/70 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[25%] bg-linear-to-b from-black/80 to-transparent" />
                <div className="relative container mx-auto px-4 pb-15 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {MovieBanner.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-300 mb-6 font-medium">
                            <span>{MovieBanner.publishYear}</span>
                            <span className="bg-gray-800/80 px-3 py-1 rounded border border-gray-700">
                                {MovieBanner.status === 'ONGOING' ? 'Đang phát' : 'Hoàn thành'}
                            </span>
                        </div>
                        <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                            {MovieBanner.description}
                        </p>

                        <div className="flex items-center gap-6">


                            <Button
                                className="w-16 h-16 rounded-full
                                bg-red-400 hover:bg-red-200
                                flex items-center justify-center
                                shadow-lg shadow-yellow-500/30
                                transition-transform hover:scale-105">
                                <Play className="w-6! h-6! fill-black text-black ml-1" />
                            </Button>


                            <div className="
                                flex items-center overflow-hidden
                                rounded-full border border-white/20
                                bg-white/5 backdrop-blur">


                                <Button className="
                                px-5! py-6 hover:bg-white/10
                                transition-colors
                                flex items-center justify-center">
                                    <Heart className="w-5! h-5! text-white" />
                                </Button>

                                <div className="w-px h-8 bg-white/20" />


                                <Button className="
                                px-5! py-6 hover:bg-white/10
                                transition-colors
                                flex items-center justify-center
                                ">
                                    <Info className="w-5! h-5! text-white" />
                                </Button>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}