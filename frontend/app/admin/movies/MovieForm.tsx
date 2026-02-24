"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import EpisodeList from "./EpisodeList";
import { Controller } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../service/api/category.api";

import { MovieFormValues, useMovieForm } from "./hooks/useMovieForm";
import { Movie } from "@/app/types/movie.type";
import { movieApi } from "../service/api/movie.api";
import { FormError } from "@/components/shared/FormError";
import { useEffect } from "react";





type Props = {
    mode: "add" | "edit";
    initialData?: Movie;
    onClose: () => void;
};


export default function MovieForm({ mode, initialData, onClose }: Props) {
    const form = useMovieForm(mode, initialData);
    const { data: categories = [], isLoading, isError, } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryApi.getAllAdminCategories,
    });

    const selected = form.watch("categoryIds") || [];

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: MovieFormValues) =>
            mode === "add"
                ? movieApi.createMovie(data)
                : movieApi.updateMovie(initialData!.id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["movies"],
            });

            onClose();

        },

    });

    const onSubmit = (data: MovieFormValues) => {
        // console.log("SUBMIT DATA:", data);
        mutation.mutate(data);
    };
    // console.log(form.formState.errors);
    // console.log(initialData);
    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto h-full custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">

            <div className="flex-1 p-6 ">
                <div className="grid grid-cols-12 gap-8">
                    {/* CỘT TRÁI: Hình ảnh */}
                    <div className="col-span-4 space-y-6">

                        {/* Poster Phim */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Poster phim</label>
                            <div onClick={() => document.getElementById("poster")?.click()}
                                className="relative aspect-2/3 w-full border-2 border-dashed border-gray-700 rounded-xl bg-gray-800 cursor-pointer overflow-hidden">
                                {/* {posterPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                                ) : ( */}
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <Upload className="w-10 h-10 mb-2" />
                                    <span className="text-xs">Upload ảnh</span>
                                </div>
                                {/* )} */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="poster"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        // form.setValue("poster", file);
                                    }}
                                />
                            </div>
                        </div>

                        {/*  Thumbnail Phim  */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Thumbnail phim (Ảnh ngang)</label>
                            <div onClick={() => document.getElementById("thumbnail")?.click()}
                                className="relative aspect-video w-full border-2 border-dashed border-gray-700 rounded-xl bg-gray-800 cursor-pointer overflow-hidden">
                                {/* Lưu ý: Cần định nghĩa biến thumbnailPreview trong component của bạn tương tự như posterPreview */}
                                {/* {thumbnailPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : ( */}
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <Upload className="w-10 h-10 mb-2" />
                                    <span className="text-xs">Upload Thumbnail</span>
                                </div>
                                {/* )} */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="thumbnail"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        // form.setValue("thumbnail", file);
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    {/* CỘT PHẢI: Thông tin chi tiết */}
                    <div className="col-span-8 space-y-">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Tên phim</label>
                                <Input type="text"
                                    {...form.register("title")}
                                    placeholder="Nhập tên phim..."
                                    className="w-full bg-gray-800 border
                                    border-gray-700 text-white
                                    px-4 py-5 rounded-lg
                                    focus:ring-2
                                    focus:ring-red-500
                                    focus:border-red-500
                                    hover:border-red-500
                                    hover:shadow-lg
                                    hover:shadow-red-500/20
                                    transition-all" />
                                <FormError message={form.formState.errors.title?.message} />

                            </div>

                            <div >
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Đường dẫn</label>
                                <Input type="text"
                                    {...form.register("slug")}
                                    placeholder="Nhập đường dẫn phim..."
                                    className="w-full bg-gray-800 border
                                    border-gray-700 text-white
                                    px-4 py-5 rounded-lg
                                    focus:ring-2
                                    focus:ring-red-500
                                    focus:border-red-500
                                    hover:border-red-500
                                    hover:shadow-lg
                                    hover:shadow-red-500/20
                                    transition-all" />
                                <FormError message={form.formState.errors.slug?.message} />

                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Năm</label>
                                <Input type="number"
                                    {...form.register("publishYear", { valueAsNumber: true })}
                                    placeholder="Năm sản xuất"
                                    className="w-full bg-gray-800 border-gray-700
                                    text-white px-4 py-2.5 rounded-lg
                                    focus-visible:ring-0 focus:border-red-500 hover:border-red-500
                                    transition-all" />
                                <FormError message={form.formState.errors.publishYear?.message} />

                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Trạng thái</label>
                                <Controller
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700
                                            text-white px-4 py-2.5 rounded-lg
                                            focus-visible:ring-0
                                            focus:border-red-500
                                            hover:border-red-500
                                            transition-all
                                            data-placeholder:text-gray-400
                                            data-placeholder:font-sm">
                                                <SelectValue placeholder="Trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent className=" bg-gray-800 border border-gray-700 text-white">
                                                <SelectItem value="ONGOING" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600 ">Đang phát</SelectItem>
                                                <SelectItem value="COMPLETED" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Hoàn thành</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormError message={form.formState.errors.status?.message} />

                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Loại phim</label>
                                <Controller
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700
                                            text-white px-4 py-2.5 rounded-lg
                                            focus-visible:ring-0 focus:border-red-500 hover:border-red-500
                                            transition-all data-placeholder:text-gray-400 data-placeholder:font-sm">
                                                <SelectValue placeholder="Chọn loại phim" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                                                <SelectItem value="SERIES" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Phim bộ</SelectItem>
                                                <SelectItem value="SINGLE" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Phim lẻ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormError message={form.formState.errors.type?.message} />

                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-1 block">Thể loại</label>
                            <div className="flex justify-between flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                {isLoading && (
                                    <span className="text-sm text-gray-500">Đang tải thể loại...</span>
                                )}

                                {isError && (
                                    <span className="text-sm text-red-500">Không tải được thể loại</span>
                                )}

                                {categories?.map((cat) => {
                                    const isSelected = selected.includes(cat.id);

                                    return (
                                        <Button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                const next = isSelected
                                                    ? selected.filter((id) => id !== cat.id)
                                                    : [...selected, cat.id];

                                                form.setValue("categoryIds", next, { shouldDirty: true });
                                            }}
                                            className={`px-3 py-1 rounded text-sm border transition
                                                ${isSelected
                                                    ? "bg-red-600 text-white border-red-600"
                                                    : "bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600 hover:text-white"}`}>
                                            {cat.name}
                                        </Button>
                                    );
                                })}
                            </div>
                            <FormError message={form.formState.errors.categoryIds?.message} />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-1 block">Mô tả nội dung</label>
                            <Textarea
                                {...form.register("description")}
                                placeholder="Nhập tóm tắt nội dung phim..."
                                className="w-full h-30 bg-gray-800 border
                                border-gray-700 text-white 
                                px-4 py-2.5 rounded-lg
                                focus:ring-2
                                focus:ring-red-500
                                focus:border-red-500
                                hover:border-red-500
                                hover:shadow-lg
                                hover:shadow-red-500/20
                                transition-all" />
                            <FormError message={form.formState.errors.description?.message} />

                        </div>

                        {mode === "edit" && initialData?.id && (
                            <EpisodeList movieId={initialData.id} />
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                <Button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Hủy bỏ
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
            </div>
        </form>
    )
}
