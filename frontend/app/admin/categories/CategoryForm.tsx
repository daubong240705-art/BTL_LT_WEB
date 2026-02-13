import { Category } from "@/app/types/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

type Props = {
    mode: "add" | "edit";
    initialData?: Category;
    onClose: () => void;
};
export default function CategoryForm({ mode, initialData, onClose }: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex-1 px-6 pb-4 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                        Tên thể loại <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
                        placeholder="Nhập tên thể loại"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
                        placeholder="hanh-dong"
                        required
                    />
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900">
                <Button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Hủy bỏ
                </Button>

                <Button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                </Button>

            </div>

        </div>

    )
}