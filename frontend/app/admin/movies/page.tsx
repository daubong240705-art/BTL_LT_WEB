import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminMoviesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trang quản lý phim</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng số: 2 phim</p>
                </div>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20">
                    <Plus className="w-5 h-5" />
                    <span>Thêm phim</span>
                </Button>
            </div>
        </div>

    );
}
