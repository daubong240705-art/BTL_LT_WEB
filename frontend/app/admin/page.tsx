import { Film, Play, User } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 ">
                <h2 className="text-xl font-semibold text-white mb-4">Trang quản trị</h2>
                <p className="text-gray-400">Chào mừng bạn đến với trang quản trị hệ thống.</p>
            </div>

            <div className="grid-col-3 gap-6 ">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <div className="flex item-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Film className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">123</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số phim</h3>
                </div>
            </div>

            <div className="grid-col-3 gap-6 ">
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
                    <div className="flex item-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <User className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">123</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số người dùng</h3>
                </div>
            </div>
            
            <div className="grid-col-3 gap-6 ">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                    <div className="flex item-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Play className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">123</span>
                    </div>
                    <h3 className="text-sm font-medium opacity-90">Tổng số luợt xem</h3>
                </div>
            </div>
        </div>


    );
}