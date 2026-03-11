"use client";


import { Heart, Search, } from 'lucide-react';

export default function MyFavoritesPage() {


    return (
        <div className="min-h-screen bg-gray-900 pb-20">

            {/* Header Banner */}
            <div className="bg-linear-to-r from-red-900 to-black border-b border-gray-800 py-16 md:py-24 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
                    <Heart className="w-96 h-96 text-white fill-white" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center gap-4 mb-4 bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        <span className="text-gray-300 font-medium tracking-wide uppercase text-sm">Bộ sưu tập cá nhân</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        Tủ Phim Của Tôi
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Nơi lưu giữ { } bộ phim tuyệt vời mà bạn yêu thích.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-20">

                {/* Toolbar (Công cụ lọc) */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-700 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                placeholder="Tìm kiếm trong tủ phim..."


                                className="w-full bg-gray-900 text-white pl-12 pr-10 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />

                        </div>

                        {/* Genre Filter */}
                        <div className="w-full md:w-64">
                            <select
                                // value={filterGenre}
                                // onChange={(e) => setFilterGenre(e.target.value)}
                                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
                                style={{ backgroundImage: 'none' }} // Tắt mũi tên mặc định nếu muốn custom
                            >
                                {/* <option value="all">Tất cả thể loại</option> */}
                                {/* {availableGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))} */}
                            </select>
                        </div>


                    </div>
                </div>

                {/* --- GRID VIEW --- */}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                </div>







            </div>
        </div>
    );
}