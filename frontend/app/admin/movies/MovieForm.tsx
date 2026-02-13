"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateMovieRequest, Movie } from "@/app/types/movie";
import EpisodeList from "./EpisodeList";
import { Controller, useWatch } from "react-hook-form";
import { useMovieForm } from "./useMovieForm";
import { fetchCategories } from "@/lib/api/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMovie, updateMovie } from "@/lib/api/movie";



type Props = {
    mode: "add" | "edit";
    initialData?: Movie;
    onClose: () => void;
};


export default function MovieForm({ mode, initialData, onClose }: Props) {
    const { form, posterPreview } = useMovieForm(mode, initialData);
    const { data: categories = [], isLoading, isError, } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const selectedIds =
        useWatch({
            control: form.control,
            name: "category_ids",
        }) ?? [];

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateMovieRequest) => {
            if (mode === "edit" && initialData?.id) {
                return updateMovie(initialData.id, data);
            }

            return createMovie(data);
        },


        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            onClose();
            form.reset();
        },
    });

    const onSubmit = (data: CreateMovieRequest) => {
        mutation.mutate(data);
    };

    console.log(form.formState.errors);
    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto h-full custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
            <div className="flex-1 p-6 ">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Poster phim</label>
                            <div onClick={() => document.getElementById("poster")?.click()}
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
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="poster"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        form.setValue("poster", file);
                                    }}
                                />
                            </div>

                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Năm</label>
                                <Input type="number"
                                    {...form.register("publish_year", { valueAsNumber: true })}
                                    placeholder="Năm sản xuất"
                                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-1 block">Trạng thái</label>
                                <Controller
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none
                                        data-placeholder:text-gray-400
                                        data-placeholder:font-sm">
                                                <SelectValue placeholder="Trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent className=" bg-gray-800 border border-gray-700 text-white">
                                                <SelectItem value="ongoing" className="cursor-pointer focus:bg-gray-700 focus:text-white data-[state=checked]:bg-red-600 data-[state=checked]:text-white">Đang phát</SelectItem>
                                                <SelectItem value="completed" className="cursor-pointer focus:bg-gray-700 focus:text-white data-[state=checked]:bg-red-600 data-[state=checked]:text-white">Hoàn thành</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 block">Tên phim</label>
                                <Input type="text"
                                    {...form.register("title")}
                                    placeholder="Nhập tên phim..."
                                    className="w-full h-10 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400  block">Đường dẫn (Slug)</label>
                                <Input type="text"
                                    {...form.register("slug")}
                                    placeholder="Nhập đường dẫn phim..."
                                    className="w-full h-10 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">Thể loại</label>
                            <div className="flex justify-between flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                {isLoading && (
                                    <span className="text-sm text-gray-500">Đang tải thể loại...</span>
                                )}

                                {isError && (
                                    <span className="text-sm text-red-500">Không tải được thể loại</span>
                                )}



                                {categories.map((cat) => {
                                    const isSelected = selectedIds.includes(cat.id);

                                    return (
                                        <Button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                const next = isSelected
                                                    ? selectedIds.filter((id) => id !== cat.id)
                                                    : [...selectedIds, cat.id];

                                                form.setValue("category_ids", next, { shouldDirty: true });
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
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">Mô tả nội dung</label>
                            <Textarea
                                {...form.register("description")}
                                placeholder="Nhập tóm tắt nội dung phim..."
                                className="w-full h-30 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-red-600 focus:outline-none" />
                        </div>
                        {mode === "edit" && initialData?.id && (
                            <EpisodeList movieId={initialData.id} />
                        )}

                    </div>
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
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>

            </div>
        </form>
    );
}
