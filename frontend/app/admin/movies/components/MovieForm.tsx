"use client";

import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AppInput } from "@/components/shared/AppInput";
import { FormError } from "@/components/shared/FormError";

import EpisodeList from "./EpisodeList";
import { categoryApi } from "../../service/api/category.api";
import { MovieFormValues, useMovieForm, useMovieMutation } from "../../hooks/movie/useMovieForm";

type Props = {
    mode: "add" | "edit";
    initialData?: Movie;
    onClose: () => void;
};

export default function MovieForm({ mode, initialData, onClose }: Props) {
    const form = useMovieForm(mode, initialData);

    const { data: categories = [], isLoading, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryApi.getAllAdminCategories,
    });

    const selected = form.watch("categoryIds") || [];
    const posterUrl = form.watch("posterUrl");
    const thumbUrl = form.watch("thumbUrl");

    const mutation = useMovieMutation(mode, form, initialData?.id, onClose);

    const onSubmit = (data: MovieFormValues) => {
        form.clearErrors("root");
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col overflow-y-auto custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
            <div className="flex-1 p-6">
                <form id="movie-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-8">
                    <div className="col-span-3 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Poster URL</label>
                            <AppInput
                                placeholder="https://..."
                                type="text"
                                color="red"
                                className="text-white px-4 py-2.5"
                                {...form.register("posterUrl")}
                            />
                            <FormError message={form.formState.errors.posterUrl?.message} />

                            <div className="relative aspect-2/3 w-full border border-gray-700 rounded-xl bg-gray-800 overflow-hidden">
                                {posterUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={posterUrl} alt="Poster preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500 text-xs">Chua co poster</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-400">Thumbnail URL</label>
                            <AppInput
                                placeholder="https://..."
                                type="text"
                                color="red"
                                className="text-white px-4 py-2.5"
                                {...form.register("thumbUrl")}
                            />
                            <FormError message={form.formState.errors.thumbUrl?.message} />

                            <div className="relative aspect-video w-full border border-gray-700 rounded-xl bg-gray-800 overflow-hidden">
                                {thumbUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={thumbUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500 text-xs">Chua co thumbnail</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-9 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Ten phim</label>
                                <AppInput
                                    placeholder="Nhap ten phim..."
                                    type="text"
                                    color="red"
                                    className="text-white px-4 py-5"
                                    {...form.register("title")}
                                />
                                <FormError message={form.formState.errors.title?.message} />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Duong dan</label>
                                <AppInput
                                    placeholder="Nhap duong dan phim..."
                                    type="text"
                                    color="red"
                                    className="text-white px-4 py-5"
                                    {...form.register("slug")}
                                />
                                <FormError message={form.formState.errors.slug?.message} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Nam</label>
                                <AppInput
                                    placeholder="Nam san xuat"
                                    type="text"
                                    color="red"
                                    className="text-white px-4 py-2.5"
                                    {...form.register("publishYear", { valueAsNumber: true })}
                                />
                                <FormError message={form.formState.errors.publishYear?.message} />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Trang thai</label>
                                <Controller
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2.5 rounded-lg focus-visible:ring-0 focus:border-red-500 hover:border-red-500 transition-all data-placeholder:text-gray-400 data-placeholder:font-sm">
                                                <SelectValue placeholder="Trang thai" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                                                <SelectItem value="ONGOING" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Dang phat</SelectItem>
                                                <SelectItem value="COMPLETED" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Hoan thanh</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormError message={form.formState.errors.status?.message} />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Loai phim</label>
                                <Controller
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2.5 rounded-lg focus-visible:ring-0 focus:border-red-500 hover:border-red-500 transition-all data-placeholder:text-gray-400 data-placeholder:font-sm">
                                                <SelectValue placeholder="Chon loai phim" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                                                <SelectItem value="SERIES" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Phim bo</SelectItem>
                                                <SelectItem value="SINGLE" className="cursor-pointer focus:bg-gray-700 data-[state=checked]:bg-red-600">Phim le</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormError message={form.formState.errors.type?.message} />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">The loai</label>
                            <div className="grid gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 grid-cols-[repeat(auto-fill,minmax(110px,1fr))]">
                                {isLoading && <span className="text-sm text-gray-500">Dang tai the loai...</span>}
                                {isError && <span className="text-sm text-red-500">Khong tai duoc the loai</span>}

                                {categories.map((cat) => {
                                    const isSelected = selected.includes(cat.id);
                                    return (
                                        <Button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                const next = isSelected
                                                    ? selected.filter((id) => id !== cat.id)
                                                    : [...selected, cat.id];

                                                form.setValue("categoryIds", next, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            className={`px-3 py-1 rounded text-sm border transition ${isSelected
                                                    ? "bg-red-600 text-white border-red-600"
                                                    : "bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600 hover:text-white"
                                                }`}
                                        >
                                            {cat.name}
                                        </Button>
                                    );
                                })}
                            </div>
                            <FormError message={form.formState.errors.categoryIds?.message} />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-2 block">Mo ta noi dung</label>
                            <Textarea
                                {...form.register("description")}
                                placeholder="Nhap tom tat noi dung phim..."
                                className="w-full h-30 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all"
                            />
                            <FormError message={form.formState.errors.description?.message} />
                        </div>
                    </div>
                </form>

                {mode === "edit" && initialData?.id && <EpisodeList movieId={initialData.id} />}
            </div>
        </div>
    );
}
