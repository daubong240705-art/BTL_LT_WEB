
import { Calendar, ChevronLeft, Heart, MessageCircle, Play, Send } from "lucide-react";
import { getMovieBySlug } from "../../service/main.api";


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
            <div className="min-h-screen bg-gray-900 pb-20">
                <div className="container mx-auto px-4 py-8">

                    {/* Nút Quay Lại */}
                    <div

                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại chi tiết phim</span>
                    </div>

                    {/* --- KHỐI CHÍNH CĂN GIỮA (Thay đổi ở đây) --- */}
                    {/* max-w-5xl: Giới hạn chiều rộng để không bị bè ra quá to */}
                    {/* mx-auto: Căn giữa khối này trong màn hình */}
                    <div className="w-full max-w-6xl mx-auto space-y-8">

                        {/* 1. MÀN HÌNH VIDEO (PLAYER) */}
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <div className="aspect-video bg-gray-900 flex items-center justify-center relative group cursor-pointer">
                                {/* Ảnh nền mờ */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={movie.thumbUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                />

                                {/* Nút Play */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600/90 group-hover:bg-red-600 p-6 rounded-full transition-all transform group-hover:scale-110 shadow-lg shadow-red-900/50">
                                        <Play className="w-10 h-10 text-white fill-current ml-1" />
                                    </div>
                                </div>

                                {/* Thanh timeline giả */}
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                                    <div className="w-1/3 h-full bg-red-600 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. THÔNG TIN & DANH SÁCH TẬP (Gom lại thành 2 cột nhỏ bên dưới Video) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Cột trái: Thông tin tập phim */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                        <span className="text-red-500">Tập 1:</span>
                                       
                                    </h1>
                                    <p className="text-gray-400 text-lg mb-4">
                                        Phim: <span className="text-white font-semibold">{movie.title}</span>
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {movie.description}
                                    </p>
                                </div>

                                {/* Phần Bình Luận */}
                                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                                        <MessageCircle className="w-6 h-6 text-red-500" />
                                        <h2 className="text-xl font-semibold text-white">
                                            Bình luận <span className="text-gray-500 text-base">2</span>
                                        </h2>
                                    </div>
                                    {/* Input bình luận */}
                                    <div className="flex gap-4 mb-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="User" className="w-10 h-10 rounded-full border border-gray-600" />
                                        <div className="flex-1 relative">
                                            <input type="text" placeholder="Viết bình luận..." className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600" />
                                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500"><Send className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    {/* List Comments */}
                                    <div className="space-y-6">

                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Danh sách tập (Để bên cạnh thông tin cho gọn) */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-6">
                                    <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-red-600 pl-3">
                                        Danh sách tập
                                    </h2>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">

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