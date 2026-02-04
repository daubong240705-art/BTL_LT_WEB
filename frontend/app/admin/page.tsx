import { Film } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Trang quản trị</h2>
                <p className="text-gray-400">Chào mừng bạn đến với trang quản trị hệ thống.</p>
            </div>

            <div className="grid-col-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <div className="flex item-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Film className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}