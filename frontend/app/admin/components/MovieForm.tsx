"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/categories";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
    mode: "add" | "edit";
    initialData?: any;
    onClose: () => void;
};


export default function MovieForm({ mode, initialData, onClose }: Props) {

    const {
        data: categories = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const [selectedCategories, setSelectedCategories] = useState<number[]>(
        mode === "edit" && initialData?.categoryIds
            ? initialData.categoryIds
            : []
    );

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);


    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPosterFile(file);

        const previewUrl = URL.createObjectURL(file);
        setPosterPreview(previewUrl);
    };

    return (
        <div className="flex flex-col h-full">

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Poster phim</label>
                            <div onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-2/3 w-full border-2 border-dashed border-gray-700 rounded-xl bg-gray-800 cursor-pointer overflow-hidden">
                                {posterPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                        <Upload className="w-10 h-10 mb-2" />
                                        <span className="text-xs">Upload ảnh</span>
                                    </div>
                                )}
                                <input ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handlePosterChange}
                                />
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
                                {isLoading && (
                                    <span className="text-sm text-gray-500">Đang tải thể loại...</span>
                                )}

                                {isError && (
                                    <span className="text-sm text-red-500">Không tải được thể loại</span>
                                )}

                                {categories.map((cat) => {
                                    const isSelected = selectedCategories.includes(cat.id);

                                    return (
                                        <Button
                                            key={cat.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategories((prev) =>
                                                    isSelected ? prev.filter((id) => id !== cat.id) : [...prev, cat.id])
                                            }
                                            className={`px-3 py-1 rounded text-sm font-medium border transition-all ${isSelected ? "bg-red-600 border-red-600 text-white" : "bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"}`}>
                                            {cat.name}
                                        </Button>
                                    );
                                })}
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
