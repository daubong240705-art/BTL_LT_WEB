
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, UseFormReturn } from "react-hook-form";
import { movieApi } from "../../service/api/movie.api";
import { EpisodePayload, episodeSchema } from "@/app/types/form.type";
import { assertApiSuccess, handleFormError, useDeleteWithRefresh } from "../_shared/mutation.utils";



export function useEpisodeForm(
    mode: "add" | "edit",
    initialData?: Episode
) {
    const form = useForm<EpisodePayload>({
        resolver: zodResolver(episodeSchema),
        values: mode === "edit" && initialData
            ? {
                name: initialData.name,
                slug: initialData.slug,
                videoUrl: initialData.videoUrl,
                episodeOrder: initialData.episodeOrder,
                movieId: initialData.movieId ?? initialData.movie_id ?? 0,
            }
            : {
                name: "",
                slug: "",
                videoUrl: "",
                episodeOrder: 1,
                movieId: initialData?.movieId ?? initialData?.movie_id ?? 0,
            }
    });



    return form;
}

export const useEpisodeMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<EpisodePayload>,
    movieId: number,
    episodeId?: number,
    onClose?: () => void
) => {
    const queryClient = useQueryClient();

    return useMutation<IBackendRes<Episode>, IBackendRes<null>, EpisodePayload>({
        mutationFn: async (data: EpisodePayload) => {
            const response = await (mode === "add"
                ? movieApi.createEpisode(data)
                : movieApi.updateEpisode(movieId!, data));
            return assertApiSuccess(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
            queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
            onClose?.();
        },
        onError: (err) => {
            handleFormError(err, form.setError);

        },
    });
};


export const useDeleteEpisode = (movieId: number) => { // Nhận movieId ở đây
    const queryClient = useQueryClient();

    // mutation gốc từ helper của bạn
    const mutation = useDeleteWithRefresh(
        movieApi.deleteEpisode,
        "Xóa tập phim thành công"
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deleteEpisode = (episodeId: number, options?: any) => {
        mutation.mutate(episodeId, {
            ...options,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
                queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
            }
        });
    };

    return {
        deleteEpisode,
        isDeleting: mutation.isPending,
    };
};
