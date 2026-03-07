import { Episode } from "@/app/types/global.type";
import { AppInput } from "@/components/shared/AppInput";
import { FormError } from "@/components/shared/FormError";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

import { EpisodeFormValues, useEpisodeForm, useEpisodeMutation } from "../../hooks/movie/useEpisodeForm";

type Props = {
    mode: "add" | "edit";
    initialData?: Episode;
    onClose: () => void;
    movieId: number;
};

export default function EpisodeForm({ mode, initialData, onClose, movieId }: Props) {
    const form = useEpisodeForm(mode, initialData);

    const mutation = useEpisodeMutation(mode, form, movieId, initialData?.id, onClose);

    const onSubmit = (data: EpisodeFormValues) => {
        form.clearErrors("root");
        mutation.mutate({ ...data, movieId });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <div className="flex-1 px-6 pb-6 space-y-2">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Thu tu</label>
                        <AppInput
                            {...form.register("episodeOrder")}
                            type="text"
                            color="red"
                            placeholder="Nhap thu tu"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.episodeOrder?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Tieu de tap</label>
                        <AppInput
                            {...form.register("name")}
                            type="text"
                            color="red"
                            placeholder="Nhap tieu de tap"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.name?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Slug</label>
                        <AppInput
                            {...form.register("slug")}
                            type="text"
                            color="red"
                            placeholder="tap-1"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.slug?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Video url</label>
                        <AppInput
                            {...form.register("videoUrl")}
                            type="text"
                            color="red"
                            placeholder="Nhap duong dan"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.videoUrl?.message} />
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                <Button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Huy bo
                </Button>
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Dang luu..." : "Luu"}
                </Button>
            </div>

        </form>
    );
}
