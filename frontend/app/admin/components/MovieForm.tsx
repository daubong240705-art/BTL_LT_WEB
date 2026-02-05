"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

type Props = {
    mode: "add" | "edit";
    initialData?: any;
    onClose: () => void;
};

export default function MovieForm({ mode, initialData, onClose }: Props) {


    return (
        <div className="flex flex-col h-full">

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Poster phim</label>
                            <div className="relative aspect-2/3 w-full border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group bg-gray-800">
                            </div>

                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Năm</label>
                                <Input type="number"
                                    placeholder="Năm sản xuất"
                                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Trạng thái</label>
                                <Select>
                                    <SelectTrigger
                                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none
                                        data-placeholder:text-gray-400
                                        data-placeholder:font-sm">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" >
                                        <SelectGroup>
                                            <SelectItem value="ongoing" className="cursor-pointer focus:bg-gray-700 focus:text-white data-[state=checked]:bg-red-600 data-[state=checked]:text-white">
                                                Đang phát</SelectItem>
                                            <SelectItem value="completed" className="cursor-pointer focus:bg-gray-700 focus:text-white data-[state=checked]:bg-red-600 data-[state=checked]:text-white">
                                                Hoàn thành</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>


                    <div className="col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 block">Tên Tiếng Việt</label>
                                <Input type="text"
                                    placeholder="Nhập tên phim..."
                                    className="w-full h-10 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>
                            {/* className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700" */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400  block">Đường dẫn (Slug)</label>
                                <Input type="text"
                                    className="w-full h-10 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">Thể loại</label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">

                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">Mô tả nội dung</label>
                            <Textarea
                                placeholder="Nhập tóm tắt nội dung phim..."
                                className="w-full h-30 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                        </div>


                    </div>
                </div>

            </div>


            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900">
                <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800"
                >
                    Hủy bỏ
                </button>

                <button
                    onClick={() => {
                        console.log("Submit");
                        onClose();
                    }}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Lưu tất cả
                </button>
            </div>
        </div>
    );
}
